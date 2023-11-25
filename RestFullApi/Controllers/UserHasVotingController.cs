namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserHasVotingController : BaseController<UserHasVotingController>
{

    public UserHasVotingController(ILogger<UserHasVotingController> logger) : base(logger)
    {
    }

    [ClaimRequirement(ClaimPermissionName.UserHasVotingController, ClaimPermissionValue.GET_ALL)]
    [HttpGet]
    public async Task<IEnumerable<UserHasVotingResponse>> Get()
    {
        return await VSContext.UserHasVotings.Select(x => new UserHasVotingResponse
        {
            VotingDescription = x.Voting.Description,
            UnitNumber = x.User.Unit.Number,
            CanVote = x.Assistant.CanVote,
            MeetingDate = x.Voting.Meeting.Date,
            Accepted = x.Accepted,
            Created = x.Created,
            Send = x.Send,
            VotedTime = x.VotedTime,
            UserId = x.UserId,
            UserUnitId = x.UserUnitId,
            AssistantId = x.AssistantId,
            AssistantUnitId = x.AssistantUnitId,
            VotingId = x.VotingId,
            VotingMeetingId = x.VotingMeetingId,
            VotingMeetingAdminId = x.VotingMeetingAdminId,
        }).ToArrayAsync();

    }

    [ClaimRequirement(ClaimPermissionName.UserHasVotingController, ClaimPermissionValue.GET)]
    [HttpGet("{userId}/{votingId}")]
    public async Task<ActionResult> Get(string userId, string votingId)
    {
        var user = await VSContext.UserHasVotings.Select(x => new UserHasVotingResponse
        {
            VotingDescription = x.Voting.Description,
            UnitNumber = x.User.Unit.Number,
            CanVote = x.Assistant.CanVote,
            MeetingDate = x.Voting.Meeting.Date,
            Accepted = x.Accepted,
            Created = x.Created,
            Send = x.Send,
            VotedTime = x.VotedTime,
            UserId = x.UserId,
            UserUnitId = x.UserUnitId,
            AssistantId = x.AssistantId,
            AssistantUnitId = x.AssistantUnitId,
            VotingId = x.VotingId,
            VotingMeetingId = x.VotingMeetingId,
            VotingMeetingAdminId = x.VotingMeetingAdminId,
        }).SingleOrDefaultAsync(x => x.UserId == userId && x.VotingId == votingId);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [ClaimRequirement(ClaimPermissionName.UserHasVotingController, ClaimPermissionValue.POST)]
    [HttpPost("{votingId}")]
    public async Task<IActionResult> Post(string votingId)
    {
        var voting = await VSContext.Votings.SingleAsync(x => x.Id == votingId);
        int assistantCount = voting.Meeting.Assistants.Count();
        int unitsTotalCount = VSContext.Units.Count();
        int minimunUnitQuorum = ((unitsTotalCount / 2) + 1);
        int minimunUnitQuorumException = (int)Math.Round(unitsTotalCount * 0.2);

        if (assistantCount <= 0)
        {
            return BadRequest(new
            {
                Error = "No han asistido ninguno de los propietarios"
            });
        }
        if (assistantCount < minimunUnitQuorum)
        {
            if (assistantCount == 1)
            {
                return BadRequest(new
                {
                    Error = $"No hay Quarum, solo ha asistido {assistantCount} propietario y se requiere mínimo {minimunUnitQuorum} unidades para el Quarum."
                });
            }
            else if (assistantCount == 0)
            {
                return BadRequest(new
                {
                    Error = $"No hay Quarum."
                });
            }

            int minutesPassedFromMeetingStarted = (int)Math.Round(DateTime.UtcNow.Subtract(voting.Meeting.Assistants.First().Created).TotalMinutes);

            if (assistantCount < minimunUnitQuorumException)
            {
                return BadRequest(new
                {
                    Error = $"No hay Quarum, solo han asistido {assistantCount} propietarios y se requiere mínimo {minimunUnitQuorum} unidades para el Quarum o en su defecto el quarum mínimo de excepción del 20% equivalentes al {minimunUnitQuorum}."
                });
            }
            else if (assistantCount >= minimunUnitQuorumException && minutesPassedFromMeetingStarted < 60)
            {
                return BadRequest(new
                {
                    Error = $"No hay Quarum, solo han asistido {assistantCount} propietarios y se requiere mínimo {minimunUnitQuorum} unidades para el Quarum o en su defecto el quarum mínimo de excepción del 20% equivalentes al {minimunUnitQuorum}, sin embargo solo han pasado {minutesPassedFromMeetingStarted} minutos. Cumplidos los 60 minutos se podrá aplicar el Quarum de excepción."
                });
            }

        }
        if (voting.Meeting.Assistants.Where(x => x.UserHasVotings.Any(x => x.VotingId == votingId))
            .Any())
        {
            return BadRequest(new
            {
                Error = "Las votaciones ya fueron generadas"
            });
        }
        foreach (var assistant in voting.Meeting.Assistants.Where(x => x.CanVote == "yes"))
        {
            await VSContext.UserHasVotings.AddAsync(new UserHasVoting
            {
                Accepted = "",
                Created = DateTime.UtcNow,
                Send = "no",
                VotedTime = null,
                UniqueKey = "",
                UserId = assistant.Unit.User?.Id!,
                UserUnitId = assistant.UnitId,
                AssistantId = assistant.Id,
                AssistantUnitId = assistant.UnitId,
                VotingId = votingId,
                VotingMeetingId = assistant.MeetingId,
                VotingMeetingAdminId = assistant.MeetingAdminId,
                AssistantMeetingId = assistant.MeetingId,
                AssistantMeetingAdminId = assistant.MeetingAdminId,

            });
            await VSContext.SaveChangesAsync();
        }
        if (assistantCount < minimunUnitQuorumException)
        {
            return BadRequest(new
            {
                Error = $"No hay Quarum, se enviaron las votaciones con el quorum mínimo de excepción del 20% equivalentes al {minimunUnitQuorum}. El secretario debe levantar el acta según lo dispone el Artículo 67 de la Ley 284."
            });
        }
        return NoContent();
    }

    [ClaimRequirement(ClaimPermissionName.UserHasVotingController, ClaimPermissionValue.PUT)]
    [HttpPut("{userId}/{votingId}")]
    public async Task<ActionResult> Put(string userId, string votingId, [FromBody] UserHasVotingRequest request)
    {
        request.UserId = userId;
        request.VotingId = votingId;

        var user = await VSContext.UserHasVotings.SingleOrDefaultAsync(x => x.UserId == request.UserId && x.VotingId == request.VotingId);
        if (user == null)
        {
            return NotFound();
        }
        if (user.VotedTime.HasValue)
        {
            return BadRequest();
        }
        user.Accepted = request.Accepted;
        user.VotedTime = DateTime.UtcNow;
        await VSContext.SaveChangesAsync();
        return Ok();
    }

}
