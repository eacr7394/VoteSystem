namespace RestFullApi.Dto.Request;

public sealed class UserRequest
{
    public string Id { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public DateTime Created { get; set; }

    public DateTime? Updated { get; set; }

    public string UnitId { get; set; } = null!;
}
