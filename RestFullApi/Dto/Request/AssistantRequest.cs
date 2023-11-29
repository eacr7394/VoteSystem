namespace RestFullApi.Dto.Request;

public sealed class AssistantRequest
{
    public string Id { get; set; } = null!;

    public string CanVote { get; set; } = null!;

    public string? EmailRepresent { get; set; }

    public string? AssistantRepresent { get; set; }

    public string UnitId { get; set; } = null!;

    public string MeetingId { get; set; } = null!;
}
