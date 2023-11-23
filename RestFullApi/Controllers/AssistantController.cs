namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.AssistantController, ClaimPermissionValue.FULL_ACCESS)]
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
            MeetingDate = x.Meeting.Date,
            UnitNumber = x.Unit.Number,

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
            MeetingDate = x.Meeting.Date,
            UnitNumber = x.Unit.Number,

        }).SingleOrDefaultAsync(x => x.Id == id);
        if(assistant == null)
        {
            return NotFound();
        }
        return Ok(assistant);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AssistantRequest request)
    {
        if (VSContext.Assistants.Any(x => x.UnitId == request.UnitId && x.MeetingId == request.MeetingId))
        {
            return BadRequest(new
            {
                Error = "La unidad ya tiene un asistente asociado a la Asamblea."
            });
        }
        var meeting = VSContext.Meetings.Single(x => x.Id == request.MeetingId);
        await VSContext.Assistants.AddAsync(new Assistant
        {
            Id = Guid.NewGuid().ToString(),
            Created = DateTime.UtcNow,
            CanVote = request.CanVote,
            UnitId = request.UnitId,
            MeetingAdminId = meeting.AdminId,
            MeetingId = request.MeetingId
        });
        await VSContext.SaveChangesAsync();
        return NoContent();
    }
}
