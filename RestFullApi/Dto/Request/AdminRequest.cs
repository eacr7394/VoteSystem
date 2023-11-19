namespace RestFullApi.Dto.Request;

public sealed class AdminRequest
{
    public string Id { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;
}
