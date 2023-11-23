namespace RestFullApi.Dto.Response;

public sealed class AssistantResponse
{
    public string Id { get; set; } = null!;

    public DateTime Created { get; set; }

    public string CanVote { get; set; } = null!;

    public string UnitId { get; set; } = null!;

    public int? UnitNumber { get; set; } = null!;

    public string MeetingId { get; set; } = null!;

    public string MeetingAdminId { get; set; } = null!;

    public DateOnly? MeetingDate { get; set; } = null!;
}
