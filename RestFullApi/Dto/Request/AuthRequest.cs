namespace RestFullApi.Dto.Request;

public class AuthRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
