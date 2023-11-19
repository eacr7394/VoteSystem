namespace RestFullApi.Dto.Request;

public sealed class MeetingRequest
{
    public string Id { get; set; } = null!;

    public DateOnly Date { get; set; }

    public string AdminId { get; set; } = null!;
}
