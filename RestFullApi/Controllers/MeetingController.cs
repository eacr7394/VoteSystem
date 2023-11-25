namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.MeetingController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class MeetingController : BaseController<MeetingController>
{
    public MeetingController(ILogger<MeetingController> logger) : base(logger)
    {
    }

    [HttpGet]
    public async Task<IEnumerable<MeetingResponse>> Get()
    {
        return await VSContext.Meetings.OrderByDescending(x => x.Date)
            .Select(x => new MeetingResponse
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
    public async Task<IActionResult> Post([FromBody] MeetingRequest request)
    {
        if (VSContext.Meetings.Any(x => x.Date == request.Date))
        {
            return BadRequest(new
            {
                Error = "La fecha dada para la Asamblea ya existe"
            });
        }
        await VSContext.Meetings.AddAsync(new Meeting
        {
            Id = Guid.NewGuid().ToString(),
            Date = request.Date,
            AdminId = request.AdminId
        });
        await VSContext.SaveChangesAsync();
        return NoContent();
    }

}
