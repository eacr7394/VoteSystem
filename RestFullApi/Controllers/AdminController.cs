namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<AdminResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.Admins.Select(x => new AdminResponse
        {
            Id = x.Id,
            Email = x.Email,
            Username = x.Username
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        using var context = new VoteSystemContext();
        var admin = await context.Admins.Select(x => new AdminResponse
        {
            Id = x.Id,
            Email = x.Email,
            Username = x.Username
        }).SingleOrDefaultAsync(x => x.Id == id);
        if(admin == null)
        {
            return NotFound();
        }
        return Ok(admin);
    }

    [HttpPost]
    public async Task Post([FromBody] AdminRequest request)
    {
        using var context = new VoteSystemContext();
        await context.Admins.AddAsync(new Admin
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            Username = request.Username,
            Password = StringExtension.GetSHA256Hash(request.Password),
        });
        await context.SaveChangesAsync();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        using var context = new VoteSystemContext();
        var admin = await context.Admins.SingleOrDefaultAsync(x => x.Id == id);
        if (admin == null)
        {
            return NotFound();
        }
        context.Admins.Remove(admin);
        await context.SaveChangesAsync();
        return Ok();
    }
}
