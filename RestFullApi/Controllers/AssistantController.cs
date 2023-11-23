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
            MeetingAdminId = x.MeetingAdminId,
            MeetingId = x.MeetingId,
            MeetingDate = x.Meeting.Date
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
            MeetingAdminId = x.MeetingAdminId,
            MeetingId = x.MeetingId,
            MeetingDate = x.Meeting.Date
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
            MeetingAdminId = request.MeetingAdminId,
            MeetingId = request.MeetingId
        });
        await VSContext.SaveChangesAsync();
    }
}
