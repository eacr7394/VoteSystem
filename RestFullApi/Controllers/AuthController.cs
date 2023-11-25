namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : BaseController<AuthController>
{
    private JwtToken JwtToken { get; }
    private IWebHostEnvironment Env { get; }

    public AuthController(ILogger<AuthController> logger, IWebHostEnvironment environment,
        ILogger<JwtToken> loggerJwtToken, IOptions<TokenValidationParametersConfiguration> options)
        : base(logger)
    {
        Env = environment;
        JwtToken = new JwtToken(loggerJwtToken, options);
    }


    [HttpPost("authorize")]
    public async Task<IActionResult> Authorize([FromBody] AuthRequest login)
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
}

