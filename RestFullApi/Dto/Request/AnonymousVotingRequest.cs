namespace RestFullApi.Dto.Request;

public sealed class AnonymousVotingRequest
{
    public string UserId { get; set; } = null!;
    public string UnitId { get; set; } = null!;
    public string VotingId { get; set; } = null!;
    public string UniqueKey { get; set; } = null!;
    public string Accepted { get; set; } = null!;
}
