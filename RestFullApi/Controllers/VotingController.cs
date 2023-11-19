namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VotingController : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<VotingResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.Votings.Select(x => new VotingResponse
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
        using var context = new VoteSystemContext();
        var voting = await context.Votings.Select(x => new VotingResponse
        {
            Id = x.Id,
            Description = x.Description,
            MeetingId = x.MeetingId,
            MeetingAdminId = x.MeetingAdminId
        }).SingleOrDefaultAsync(x => x.Id == id);
        if(voting == null)
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
