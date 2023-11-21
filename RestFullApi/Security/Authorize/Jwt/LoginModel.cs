namespace RestFullApi.Security.Authorize.Jwt;

public class LoginModel
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
