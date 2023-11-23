namespace RestFullApi.Dto.Response;

public class AuthResponse
{
    public string Id { get; set; } = null!;
    public string[] Roles { get; set; } = null!;
}
