namespace RestFullApi.Dto.Response;

public sealed class MeetingResponse
{
    public string Id { get; set; } = null!;

    public DateOnly Date { get; set; }

    public string AdminId { get; set; } = null!;
}
