namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<UserResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.Users.Select(x => new UserResponse
        {
            Id = x.Id,
            Name = x.Name,
            Lastname = x.Lastname,
            UnitId = x.UnitId,
            Email = x.Email,
            Created = x.Created,
            Updated = x.Updated
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        using var context = new VoteSystemContext();
        var user = await context.Users.Select(x => new UserResponse
        {
            Id = x.Id,
            Name = x.Name,
            Lastname = x.Lastname,
            UnitId = x.UnitId,
            Email = x.Email,
            Created = x.Created,
            Updated = x.Updated
        }).SingleOrDefaultAsync(x => x.Id == id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPost]
    public async Task Post([FromBody] UserRequest request)
    {
        using var context = new VoteSystemContext();
        await context.Users.AddAsync(new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Lastname = request.Lastname,
            UnitId = request.UnitId,
            Email = request.Email,
            Created = DateTime.UtcNow
        });
        await context.SaveChangesAsync();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(string id, [FromBody] UserRequest request)
    {
        request.Id = id;
        using var context = new VoteSystemContext();
        var user = await context.Users.SingleOrDefaultAsync(x => x.Id == request.Id);
        if (user == null)
        {
            return NotFound();
        }
        user.Updated = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        using var context = new VoteSystemContext();
        var user = await context.Users.SingleOrDefaultAsync(x => x.Id == id);
        if (user == null)
        {
            return NotFound();
        }
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return Ok();
    }
}
