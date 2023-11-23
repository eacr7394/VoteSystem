namespace RestFullApi.Controllers;

[ClaimRequirement(ClaimPermissionName.UserController, ClaimPermissionValue.FULL_ACCESS)]
[Route("api/[controller]")]
[ApiController]
public class UserController : BaseController<UserController>
{
    public UserController(ILogger<UserController> logger, VoteSystemContext voteSystemContext) 
        : base(logger, voteSystemContext)
    {
    }

    [HttpGet]
    public async Task<IEnumerable<UserResponse>> Get()
    {
        return await VSContext.Users.Select(x => new UserResponse
        {
            Id = x.Id,
            Name = x.Name,
            Lastname = x.Lastname,
            UnitId = x.UnitId,
            Email = x.Email,
            Created = x.Created,
            Updated = x.Updated,
            UnitNumber = x.Unit.Number
        }).ToArrayAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(string id)
    {
        var user = await VSContext.Users.Select(x => new UserResponse
        {
            Id = x.Id,
            Name = x.Name,
            Lastname = x.Lastname,
            UnitId = x.UnitId,
            Email = x.Email,
            Created = x.Created,
            Updated = x.Updated,
            UnitNumber = x.Unit.Number
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
        await VSContext.Users.AddAsync(new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Lastname = request.Lastname,
            UnitId = request.UnitId,
            Email = request.Email,
            Created = DateTime.UtcNow
        });
        await VSContext.SaveChangesAsync();
    }

}
