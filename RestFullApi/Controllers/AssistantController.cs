namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssistantController : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<AssistantResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.Assistants.Select(x => new AssistantResponse
        {
            Id = x.Id,
            Created = x.Created,
            CanVote = x.CanVote,
            UnitId = x.UnitId,
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        using var context = new VoteSystemContext();
        var assistant = await context.Assistants.Select(x => new AssistantResponse
        {
            Id = x.Id,
            Created = x.Created,
            CanVote = x.CanVote,
            UnitId = x.UnitId,
        }).SingleOrDefaultAsync(x => x.Id == id);
        if(assistant == null)
        {
            return NotFound();
        }
        return Ok(assistant);
    }

    [HttpPost]
    public async Task Post([FromBody] AssistantRequest request)
    {
        using var context = new VoteSystemContext();
        await context.Assistants.AddAsync(new Assistant
        {
            Id = Guid.NewGuid().ToString(),
            Created = DateTime.UtcNow,
            CanVote = request.CanVote,
            UnitId = request.UnitId,

        });
        await context.SaveChangesAsync();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        using var context = new VoteSystemContext();
        var assistant = await context.Assistants.SingleOrDefaultAsync(x => x.Id == id);
        if (assistant == null)
        {
            return NotFound();
        }
        context.Assistants.Remove(assistant);
        await context.SaveChangesAsync();
        return Ok();
    }
}
