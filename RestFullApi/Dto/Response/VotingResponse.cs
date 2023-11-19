namespace RestFullApi.Dto.Response;

public sealed class VotingResponse
{
    public string Id { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string MeetingId { get; set; } = null!;

    public string MeetingAdminId { get; set; } = null!;
}
