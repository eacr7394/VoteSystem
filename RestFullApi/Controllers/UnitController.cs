namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UnitController : BaseController<UnitController>
{
    public UnitController(ILogger<UnitController> logger) 
        : base(logger)
    {
    }

    [ClaimRequirement(ClaimPermissionName.UnitController, ClaimPermissionValue.GET_ALL)]
    [HttpGet]
    public async Task<IEnumerable<UnitResponse>> Get()
    {
        return await VSContext.Units.Select(x => new UnitResponse
        {
            Id = x.Id,
            Number = x.Number
        }).ToArrayAsync();
    }

    [ClaimRequirement(ClaimPermissionName.UnitController, ClaimPermissionValue.GET)]
    [HttpGet("{number}")]
    public async Task<ActionResult> Get(int number)
    {
        var unit = await VSContext.Units.Select(x => new UnitResponse
        {
            Id = x.Id,
            Number = x.Number,
        }).SingleOrDefaultAsync(x => x.Number == number);
        if (unit == null)
        {
            return NotFound();
        }
        return Ok(unit);
    }

}
