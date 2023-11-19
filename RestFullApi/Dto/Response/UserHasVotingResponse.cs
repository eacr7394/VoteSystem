namespace RestFullApi.Dto.Response;

public sealed class UserHasVotingResponse
{
    public string Accepted { get; set; } = null!;

    public DateTime? VotedTime { get; set; }

    public DateTime Created { get; set; }

    public string UniqueKey { get; set; } = null!;

    public string Send { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string UserUnitId { get; set; } = null!;

    public string AssistantId { get; set; } = null!;

    public string AssistantUnitId { get; set; } = null!;

    public string VotingId { get; set; } = null!;

    public string VotingMeetingId { get; set; } = null!;

    public string VotingMeetingAdminId { get; set; } = null!;
}
