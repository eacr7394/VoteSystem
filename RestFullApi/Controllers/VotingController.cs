namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.AdminController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class VotingController : BaseController<VotingController>
{
    public VotingController(ILogger<VotingController> logger, VoteSystemContext voteSystemContext)
        : base(logger, voteSystemContext)
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
            MeetingAdminId = x.MeetingAdminId
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
            MeetingAdminId = x.MeetingAdminId
        }).SingleOrDefaultAsync(x => x.Id == id);
        if (voting == null)
        {
            return NotFound();
        }
        return Ok(voting);
    }

    [HttpPost]
    public async Task Post([FromBody] VotingRequest request)
    {
        using var context = new VoteSystemContext();
        await context.Votings.AddAsync(new Voting
        {
            Id = Guid.NewGuid().ToString(),
            Description = request.Description,
            MeetingId = request.MeetingId,
            MeetingAdminId = request.MeetingAdminId
        });
        await context.SaveChangesAsync();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        using var context = new VoteSystemContext();
        var voting = await context.Votings.SingleOrDefaultAsync(x => x.Id == id);
        if (voting == null)
        {
            return NotFound();
        }
        context.Votings.Remove(voting);
        await context.SaveChangesAsync();
        return Ok();
    }
}
