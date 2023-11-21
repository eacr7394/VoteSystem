namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.AdminController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class MeetingController : BaseController<MeetingController>
{
    public MeetingController(ILogger<MeetingController> logger, VoteSystemContext voteSystemContext)
        : base(logger, voteSystemContext)
    {
    }

    [HttpGet]
    public async Task<IEnumerable<MeetingResponse>> Get()
    {
        return await VSContext.Meetings.Select(x => new MeetingResponse
        {
            Id = x.Id,
            Date = x.Date,
            AdminId = x.AdminId
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        var meeting = await VSContext.Meetings.Select(x => new MeetingResponse
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
        await VSContext.Meetings.AddAsync(new Meeting
        {
            Id = Guid.NewGuid().ToString(),
            Date = request.Date,
            AdminId = request.AdminId
        });
        await VSContext.SaveChangesAsync();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var meeting = await VSContext.Meetings.SingleOrDefaultAsync(x => x.Id == id);
        if (meeting == null)
        {
            return NotFound();
        }
        VSContext.Meetings.Remove(meeting);
        await VSContext.SaveChangesAsync();
        return Ok();
    }
}
