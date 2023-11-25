namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.VotingController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class VotingController : BaseController<VotingController>
{
    public VotingController(ILogger<VotingController> logger)
        : base(logger)
    {
    }

    [HttpGet]
    public async Task<IEnumerable<VotingResponse>> Get()
    {
        return await VSContext.Votings.Select(x => new VotingResponse
        {
            Id = x.Id,
            Description = x.Description,
            MeetingId = x.MeetingId,
            MeetingDate = x.Meeting.Date
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        var voting = await VSContext.Votings.Select(x => new VotingResponse
        {
            Id = x.Id,
            Description = x.Description,
            MeetingId = x.MeetingId,
            MeetingDate = x.Meeting.Date
        }).SingleOrDefaultAsync(x => x.Id == id);
        if (voting == null)
        {
            return NotFound();
        }
        return Ok(voting);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] VotingRequest request)
    {
        using var context = new VoteSystemContext();
        if (VSContext.Votings.Any(x => x.MeetingId == request.MeetingId && x.Description == request.Description))
        {
            return BadRequest(new
            {
                Error = "Ya existe la votación asociada a la Asamblea."
            });
        }
        var meeting = context.Meetings.Single(x => x.Id == request.MeetingId);
        await context.Votings.AddAsync(new Voting
        {
            Id = Guid.NewGuid().ToString(),
            Description = request.Description,
            MeetingId = request.MeetingId,
            MeetingAdminId = meeting.AdminId
        });
        await context.SaveChangesAsync();

        return NoContent();
    }

}
