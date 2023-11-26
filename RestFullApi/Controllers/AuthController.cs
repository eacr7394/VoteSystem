namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : BaseController<AuthController>
{
    private JwtToken JwtToken { get; }
    private IWebHostEnvironment Env { get; }
    private SmtpClient SmtpClient { get; }

    public AuthController(ILogger<AuthController> logger, IWebHostEnvironment environment,
        ILogger<JwtToken> loggerJwtToken, IOptions<TokenValidationParametersConfiguration> options,
        IOptions<EmailConfiguration> emailConfOptions)
        : base(logger)
    {
        Env = environment;
        JwtToken = new JwtToken(loggerJwtToken, options);
        SmtpClient = new(emailConfOptions);
    }

    [HttpPost("authorize")]
    public IActionResult Authorize([FromBody] AuthRequest login)
    {
        var token = JwtToken.GenToken(Response, login, out SecurityError SecurityError, out string ErrorMessage, out AuthResponse AuthResponse);

        if (Env.IsDevelopment() && SecurityError.NONE == SecurityError)
        {
            Response.Headers.Append(JwtToken.Authorization, token);
        }
        if (SecurityError.FORBID == SecurityError)
        {
            return Forbid();
        }
        if (SecurityError.BAD_REQUEST == SecurityError)
        {
            return BadRequest(new
            {
                Error = ErrorMessage
            });
        }
        Logger.LogInformation(Serialize(AuthResponse));
        return Ok(AuthResponse);
    }

    [HttpPost("renewToken")]
    public async Task<IActionResult> RenewToken()
    {
        var token = await JwtToken.RenewTokenAsync(HttpContext);

        if (Env.IsDevelopment())
        {
            Response.Headers.Append(JwtToken.Authorization, token);
        }
        return NoContent();
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(JwtToken.Authorization);

        return Ok();
    }

    private async Task SendChangePasswordRequest(PasswordRecoveryRequest request, string uniqueKey)
    {
        var template = new SmtpTemplate(SmtpTemplate.Template.VoteRequestChangePassword);

        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "ADMIN_ID",
            Value = request.AdminId,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "REQUEST_ID",
            Value = request.Id,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "UNIQUE_KEY",
            Value = uniqueKey
        });

        template.AddResources(VoteRequest.PhMonteBelloLogo, VoteRequest.PhMonteBelloLogoCid);

        await SmtpClient.SendAsync(request.Admin.Email, template);
    }

    [HttpPost("send-change-password-request/{email}")]
    public async Task<IActionResult> SendChangePasswordRequest(string email)
    {
        var uniqueKey = StringExtension.RandomString(250);
        var admin = await VSContext.Admins.SingleOrDefaultAsync(x => x.Email == email);

        if (admin != null)
        {
            PasswordRecoveryRequest request = new()
            {
                Id = new Guid().ToString(),
                AdminId = admin.Id,
                UniqueKey = StringExtension.GetSHA256Hash(uniqueKey),
                Used = false,
                Created = DateTime.UtcNow
            };
            await VSContext.PasswordRecoveryRequests.AddAsync(request);
            await SendChangePasswordRequest(request, uniqueKey);
            await VSContext.SaveChangesAsync();
        }

        return NotFound();
    }

    [HttpPost("change-password/{requestId}/{uniqueKey}/{adminId}/{newPassword}")]
    public async Task<IActionResult> ChangePassword(string requestId, string uniqueKey, string adminId, string newPassword)
    {
        var uniqueKeyHash = StringExtension.GetSHA256Hash(uniqueKey);

        var admin = await VSContext.PasswordRecoveryRequests.SingleOrDefaultAsync(x => x.Id == requestId && !x.Used &&
                                                                                       x.AdminId == adminId && x.UniqueKey == uniqueKeyHash);
        if (admin == null || DateTime.UtcNow.Subtract(admin.Created).TotalMinutes > 10)
        {
            return Forbid();
        }
        admin.Admin.Password = StringExtension.GetSHA256Hash(newPassword);
        admin.Used = true;
        admin.PasswordChangeDate = DateTime.UtcNow;
        await VSContext.SaveChangesAsync();
        return NotFound();
    }
}

