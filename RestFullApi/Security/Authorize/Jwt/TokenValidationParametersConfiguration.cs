namespace RestFullApi.Security.Authorize.Jwt;

public class TokenValidationParametersConfiguration
{
    public string Domain { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string IssuerSigningKey { get; set; } = null!;
}
