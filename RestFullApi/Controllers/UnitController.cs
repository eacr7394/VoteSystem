namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UnitController : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<UnitResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.Units.Select(x => new UnitResponse
        {
            Id = x.Id,
            Number = x.Number
        }).ToArrayAsync();
    }

    [HttpGet("{number}")]
    public async Task<ActionResult> Get(int number)
    {
        using var context = new VoteSystemContext();
        var unit = await context.Units.Select(x => new UnitResponse
        {
            Id = x.Id,
            Number = x.Number,
        }).SingleOrDefaultAsync(x => x.Number == number);
        if(unit == null)
        {
            return NotFound();
        }
        return Ok(unit);
    }

}
