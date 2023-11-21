namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.AdminController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class AssistantController : BaseController<AssistantController>
{
    public AssistantController(ILogger<AssistantController> logger, 
        VoteSystemContext voteSystemContext) : base(logger, voteSystemContext)
    {
    }

    [HttpGet]
    public async Task<IEnumerable<AssistantResponse>> Get()
    {
        return await VSContext.Assistants.Select(x => new AssistantResponse
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
        var assistant = await VSContext.Assistants.Select(x => new AssistantResponse
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
        await VSContext.Assistants.AddAsync(new Assistant
        {
            Id = Guid.NewGuid().ToString(),
            Created = DateTime.UtcNow,
            CanVote = request.CanVote,
            UnitId = request.UnitId,

        });
        await VSContext.SaveChangesAsync();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var assistant = await VSContext.Assistants.SingleOrDefaultAsync(x => x.Id == id);
        if (assistant == null)
        {
            return NotFound();
        }
        VSContext.Assistants.Remove(assistant);
        await VSContext.SaveChangesAsync();
        return Ok();
    }
}
