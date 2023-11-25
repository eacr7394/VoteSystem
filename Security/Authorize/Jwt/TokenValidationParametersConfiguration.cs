namespace Security.Authorize.Jwt;

public class TokenValidationParametersConfiguration
{
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string IssuerSigningKey { get; set; } = null!;
}
