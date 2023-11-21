namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : BaseController<AuthController>
{
    public const string Authorization = "Authorization";
    private TokenValidationParametersConfiguration tokenParametersConfiguration { get; }
    private IWebHostEnvironment env { get; }

    public AuthController(ILogger<AuthController> logger, VoteSystemContext voteSystemContext,
        IOptions<TokenValidationParametersConfiguration> options, IWebHostEnvironment environment)
        : base(logger, voteSystemContext)
    {
        tokenParametersConfiguration = options.Value;
        env = environment;
    }

    private IActionResult SendJSONWebToken(LoginModel login)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenParametersConfiguration.IssuerSigningKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var user = VSContext.Admins.SingleOrDefault(x => x.Username == login.Username);

        if (user == null)
        {
            return Forbid();
        }
        var passwordSha256 = StringExtension.GetSHA256Hash(login.Password);
        if (user.Password != passwordSha256)
        {
            return Forbid();
        }

        Logger.LogInformation(Serialize(user));

        var permissions = user.Roles.Select(role => role.PermissionControllers);
        List<Claim> claims = [new Claim(ClaimTypes.Name, login.Username)];
        foreach (var permission in permissions)
        {
            foreach (var item in permission)
            {
                claims.Add(new Claim(item.ControllerName, item.ControllerAction));
            }
        }

        var jwtSecurityToken = new JwtSecurityToken(issuer: tokenParametersConfiguration.Issuer,
          audience: tokenParametersConfiguration.Audience,
          claims: claims.ToArray(),
          expires: DateTime.Now.AddMinutes(120),
          signingCredentials: credentials);

        var token = $"Bearer {new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken)}";


        Response.Cookies.Append(Authorization, token, new CookieOptions()
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Domain = tokenParametersConfiguration.Domain,
            Expires = DateTime.UtcNow.AddDays(1),
            MaxAge = TimeSpan.FromDays(1),
        });

        if (env.IsDevelopment())
        {
            Response.Headers.Append(Authorization, token);
        }
        return Ok();
    }


    [HttpPost("authorize")]
    public IActionResult Authorize([FromBody] LoginModel login)
    {
        return SendJSONWebToken(login);
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(Authorization);

        return Ok();
    }
}

