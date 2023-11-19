namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MeetingController : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<MeetingResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.Meetings.Select(x => new MeetingResponse
        {
            Id = x.Id,
            Date = x.Date,
            AdminId = x.AdminId
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        using var context = new VoteSystemContext();
        var meeting = await context.Meetings.Select(x => new MeetingResponse
        {
            Id = x.Id,
            Date = x.Date,
            AdminId = x.AdminId
        }).SingleOrDefaultAsync(x => x.Id == id);
        if (meeting == null)
        {
            return NotFound();
        }
        return Ok(meeting);
    }

    [HttpPost]
    public async Task Post([FromBody] MeetingRequest request)
    {
        using var context = new VoteSystemContext();
        await context.Meetings.AddAsync(new Meeting
        {
            Id = Guid.NewGuid().ToString(),
            Date = request.Date,
            AdminId = request.AdminId
        });
        await context.SaveChangesAsync();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        using var context = new VoteSystemContext();
        var meeting = await context.Meetings.SingleOrDefaultAsync(x => x.Id == id);
        if (meeting == null)
        {
            return NotFound();
        }
        context.Meetings.Remove(meeting);
        await context.SaveChangesAsync();
        return Ok();
    }
}
