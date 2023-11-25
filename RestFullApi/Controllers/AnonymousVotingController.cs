namespace RestFullApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnonymousVotingController : BaseController<VotingController>
{
    private SmtpClient SmtpClient { get; }

    public AnonymousVotingController(ILogger<VotingController> logger, IOptions<EmailConfiguration> emailConfOptions)
        : base(logger)
    {
        SmtpClient = new(emailConfOptions);
    }

    [HttpGet("{unitId}/{votingId}")]
    public async Task<ActionResult> Get(string unitId, string votingId)
    {
        var voting = await VSContext.Votings.SingleOrDefaultAsync(x => x.Id == votingId);
        var unit = await VSContext.Units.SingleOrDefaultAsync(x => x.Id == unitId);

        if (voting == null || unit == null)
        {
            return NotFound();
        }
        return Ok(new AnonymousVotingResponse
        {
            Description = voting.Description,
            MeetingDate = voting.Meeting.Date,
            UnitNumber = unit.Number
        });
    }

    private async Task SendVoteRequestAcknowledgment(User user, Voting voting, bool accepted)
    {
        var template = new SmtpTemplate(SmtpTemplate.Template.VoteRequestAcknowledgment);
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
            Name = "MEETING_DATE",
            Value = voting.Meeting.Date.ToString("yyyy-MM-dd"),
        });
        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "ACCEPTED",
            Value = accepted ? "A FAVOR" : "EN CONTRA"
        });

        template.AddResources(VoteRequest.PhMonteBelloLogo, VoteRequest.PhMonteBelloLogoCid);

        await SmtpClient.SendAsync(user.Email, template);
    }

    [HttpPost]
    public async Task<ActionResult> Post(AnonymousVotingRequest request)
    {
        if (request.Accepted != "no" && request.Accepted != "yes")
        {
            return BadRequest(new
            {
                Error = "Valor inválido para el parámetro 'Accepted'"
            });
        }

        var voting = await VSContext.Votings.SingleOrDefaultAsync(x => x.Id == request.VotingId);

        var forbidResult = StatusCode(443, new
        {
            Error = "Usted no está autorizado."
        });

        if (voting == null)
        {
            return forbidResult;
        }
        var userHasVotings = voting.UserHasVotings.SingleOrDefault(x => x.UserId == request.UserId && x.UserUnitId == request.UnitId);

        if (userHasVotings == null)
        {
            return forbidResult;
        }

        if (userHasVotings.UniqueKey != StringExtension.GetSHA256Hash(request.UniqueKey))
        {
            return forbidResult;
        }

        if (userHasVotings.Accepted == "" && userHasVotings.VotedTime.HasValue)
        {
            return BadRequest(new
            {
                Error = "La votación ya ha cerrado."
            });
        }
        if (userHasVotings.Accepted != "" && userHasVotings.VotedTime.HasValue)
        {
            return BadRequest(new
            {
                Error = "Usted ya ha votado."
            });
        }
        userHasVotings.Accepted = request.Accepted;

        userHasVotings.VotedTime = DateTime.UtcNow;

        await SendVoteRequestAcknowledgment(userHasVotings.User, voting, userHasVotings.Accepted == "yes");

        await VSContext.SaveChangesAsync();

        return NoContent();
    }

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
        }).ToArrayAsync();

    }
}
