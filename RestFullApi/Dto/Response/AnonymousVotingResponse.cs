namespace RestFullApi.Dto.Response;

public sealed class AnonymousVotingResponse
{
    public int? UnitNumber { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateOnly? MeetingDate { get; set; } = null!;
}
