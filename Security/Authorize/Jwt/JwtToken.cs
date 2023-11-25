namespace Security.Authorize.Jwt;

public class JwtToken
{
    public const string Authorization = "Authorization";
    private TokenValidationParametersConfiguration tokenParametersConfiguration { get; }
    private ILogger<JwtToken> Logger { get; }
    private VoteSystemContext VSContext { get; }

    public JwtToken(ILogger<JwtToken> logger, IOptions<TokenValidationParametersConfiguration> options)
    {
        tokenParametersConfiguration = options.Value;
        Logger = logger;
        VSContext = new();
    }

    public string GenToken(HttpResponse httpResponse, AuthRequest login, out SecurityError SecurityError, out string ErrorMessage, out AuthResponse AuthResponse)
    {
        ErrorMessage = null!;
        AuthResponse = null!;
        SecurityError = SecurityError.NONE;

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenParametersConfiguration.IssuerSigningKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var user = VSContext.Admins.SingleOrDefault(x => x.Username == login.Username);

        var passwordSha256 = GetSHA256Hash(login.Password);

        if (user == null)
        {
            SecurityError = SecurityError.FORBID;
            return null!;
        }
        else if (user.BlockedTime.HasValue && (DateTime.UtcNow - user.BlockedTime.Value).Hours <= 24)
        {
            ErrorMessage = "Su usuario ha sido bloqueado";
            SecurityError = SecurityError.BAD_REQUEST;
            return null!;
        }
        else if (user.Password != passwordSha256 && user.BlockCounter < 3)
        {
            user.BlockCounter++;
            VSContext.SaveChanges();
            SecurityError = SecurityError.FORBID;
            return null!;
        }
        else if (user.Password != passwordSha256 && user.BlockCounter >= 3)
        {
            user.BlockCounter = 0;
            user.BlockedTime = DateTime.UtcNow;
            VSContext.SaveChanges();
            ErrorMessage = "Su usuario ha sido bloqueado";
            SecurityError = SecurityError.BAD_REQUEST;
            return null!;
        }

        var permissions = user.Roles.Select(role => role.PermissionControllers);
        List<Claim> claims = [new Claim(ClaimTypes.Name, login.Username)];

        foreach (var permission in permissions)
        {
            foreach (var item in permission)
            {
                claims.Add(new Claim(item.ControllerName, item.ControllerAction));
            }
        }

        AuthResponse = new AuthResponse
        {
            Id = user.Id,
            Roles = []
        };

        var jwtSecurityToken = new JwtSecurityToken(issuer: tokenParametersConfiguration.Issuer,
          audience: tokenParametersConfiguration.Audience,
          claims: claims.ToArray(),
          expires: DateTime.Now.AddMinutes(120),
          signingCredentials: credentials);

        var token = $"Bearer {new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken)}";

        if (user.BlockCounter != 0)
        {
            user.BlockCounter = 0;
            VSContext.SaveChanges();
        }

        httpResponse.Cookies.Append(Authorization, token, new CookieOptions()
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(30),
            MaxAge = TimeSpan.FromMinutes(35),
        });

        return token;

    }

    public async Task<string> RenewTokenAsync(HttpContext httpContext)
    {
        List<Claim> claims = httpContext.User.Claims.ToList();

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenParametersConfiguration.IssuerSigningKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = new JwtSecurityToken(issuer: tokenParametersConfiguration.Issuer,
          audience: tokenParametersConfiguration.Audience,
          claims: claims.ToArray(),
          expires: DateTime.Now.AddMinutes(120),
          signingCredentials: credentials);

        var token = await Task.FromResult($"Bearer {new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken)}");

        httpContext.Response.Cookies.Append(Authorization, token, new CookieOptions()
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(30),
            MaxAge = TimeSpan.FromMinutes(35),
        });

        return await Task.FromResult(token);

    }
}