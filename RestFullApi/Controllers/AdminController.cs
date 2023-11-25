namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.AdminController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class AdminController : BaseController<AdminController>
{
    public AdminController(ILogger<AdminController> logger) 
        : base(logger)
    {
    }

    [HttpGet]
    public async Task<IEnumerable<AdminResponse>> Get()
    {
        return await VSContext.Admins.Select(x => new AdminResponse
        {
            Id = x.Id,
            Email = x.Email,
            Username = x.Username
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        var admin = await VSContext.Admins.Select(x => new AdminResponse
        {
            Id = x.Id,
            Email = x.Email,
            Username = x.Username
        }).SingleOrDefaultAsync(x => x.Id == id);
        if (admin == null)
        {
            return NotFound();
        }
        return Ok(admin);
    }

    [HttpPost]
    public async Task Post([FromBody] AdminRequest request)
    {
        await VSContext.Admins.AddAsync(new Admin
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            Username = request.Username,
            Password = StringExtension.GetSHA256Hash(request.Password),
        });
        await VSContext.SaveChangesAsync();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var admin = await VSContext.Admins.SingleOrDefaultAsync(x => x.Id == id);
        if (admin == null)
        {
            return NotFound();
        }
        VSContext.Admins.Remove(admin);
        await VSContext.SaveChangesAsync();
        return Ok();
    }
}
