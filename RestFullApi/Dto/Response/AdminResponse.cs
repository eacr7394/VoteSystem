namespace RestFullApi.Dto.Response;

public sealed class AdminResponse
{
    public string Id { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;
}
