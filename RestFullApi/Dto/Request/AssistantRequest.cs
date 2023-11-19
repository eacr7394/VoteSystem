namespace RestFullApi.Dto.Request;

public sealed class AssistantRequest
{
    public string Id { get; set; } = null!;

    public DateTime Created { get; set; }

    public string CanVote { get; set; } = null!;

    public string UnitId { get; set; } = null!;
}
