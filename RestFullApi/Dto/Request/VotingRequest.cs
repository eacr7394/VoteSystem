namespace RestFullApi.Dto.Request;

public sealed class VotingRequest
{
    public string Id { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string MeetingId { get; set; } = null!;

    public string MeetingAdminId { get; set; } = null!;
}
