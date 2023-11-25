namespace RestFullApi.Dto.Response;

public sealed class UserHasVotingResponse
{
    public string VotingDescription { get; set; } = null!;
    public int? UnitNumber { get; set; } = null!;
    public string CanVote { get; set; } = null!;
    public DateOnly? MeetingDate { get; set; } = null!;


    public string Accepted { get; set; } = null!;
    public string Send { get; set; } = null!;

    public DateTime? VotedTime { get; set; }

    public DateTime Created { get; set; }

    public string UserId { get; set; } = null!;

    public string UserUnitId { get; set; } = null!;

    public string AssistantId { get; set; } = null!;

    public string AssistantUnitId { get; set; } = null!;

    public string VotingId { get; set; } = null!;

    public string VotingMeetingId { get; set; } = null!;

    public string VotingMeetingAdminId { get; set; } = null!;
}
