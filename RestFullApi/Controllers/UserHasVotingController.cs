namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserHasVotingController : ControllerBase
{
    private readonly SmtpClient SmtpClient;

    public UserHasVotingController(SmtpClient smtpClient)
    {
        SmtpClient = smtpClient;
    }

    [HttpGet]
    public async Task<IEnumerable<UserHasVotingResponse>> Get()
    {
        using var context = new VoteSystemContext();
        return await context.UserHasVotings.Select(x => new UserHasVotingResponse
        {
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

    [HttpGet("{userId}/{votingId}")]
    public async Task<ActionResult> Get(string userId, string votingId)
    {
        using var context = new VoteSystemContext();
        var user = await context.UserHasVotings.Select(x => new UserHasVotingResponse
        {
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

    [HttpPost]
    public async Task Post([FromBody] UserHasVotingRequest request)
    {
        using var context = new VoteSystemContext();
        var uniqueKey = StringExtension.RandomString(250);
        var user = context.Users.Single(x=> x.Id == request.UserId);
        var voting = context.Votings.Single(x => x.Id == request.VotingId);
        var template = new SmtpTemplate(SmtpTemplate.Template.VoteRequest);
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "NOMBRE",
            Value = user.Name,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "APELLIDO",
            Value = user.Lastname,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "DESCRIPCION_VOTACION",
            Value = voting.Description,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "USER_ID",
            Value = user.Id,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "UNIT_ID",
            Value = user.UnitId!,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "VOTING_ID",
            Value = voting.Id,
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "UNIQUE_KEY",
            Value = uniqueKey,
        });
        template.AddResources(VoteRequest.PhMonteBelloLogo, VoteRequest.PhMonteBelloLogoCid);
        await context.UserHasVotings.AddAsync(new UserHasVoting
        {
            Accepted = "no",
            Created = DateTime.UtcNow,
            Send = "yes",
            VotedTime = null,
            UserId = request.UserId,
            UserUnitId = request.UserUnitId,
            AssistantId = request.AssistantId,
            AssistantUnitId = request.AssistantUnitId,
            VotingId = request.VotingId,
            VotingMeetingId = request.VotingMeetingId,
            VotingMeetingAdminId = request.VotingMeetingAdminId,
        });
        SmtpClient.Send(user.Email, template);
        await context.SaveChangesAsync();
    }

    [HttpPut("{userId}/{votingId}")]
    public async Task<ActionResult> Put(string userId, string votingId, [FromBody] UserHasVotingRequest request)
    {
        request.UserId = userId;
        request.VotingId = votingId;

        using var context = new VoteSystemContext();
        var user = await context.UserHasVotings.SingleOrDefaultAsync(x => x.UserId == request.UserId && x.VotingId == request.VotingId);
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
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{userId}/{votingId}")]
    public async Task<ActionResult> Delete(string userId, string votingId)
    {
        using var context = new VoteSystemContext();
        var user = await context.UserHasVotings.SingleOrDefaultAsync(x => x.UserId == userId && x.VotingId == votingId);
        if (user == null)
        {
            return NotFound();
        }
        context.UserHasVotings.Remove(user);
        await context.SaveChangesAsync();
        return Ok();
    }
}
