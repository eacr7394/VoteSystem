using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace JobSchedule;

public class SendUserVotingTask : IJob
{
    private SmtpClient SmtpClient { get; }
    private ILogger<SendUserVotingTask> Logger { get; }
    public SendUserVotingTask(ILogger<SendUserVotingTask> logger, IOptions<EmailConfiguration> emailConfOptions)
    {
        SmtpClient = new(emailConfOptions);
        Logger = logger;
    }

    private async Task Send(User user, Voting voting, string uniqueKey)
    {
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

        await SmtpClient.SendAsync(user.Email, template);
    }

    public async Task Execute(IJobExecutionContext jobContext)
    {
        using var context = new VoteSystemContext();
        using var trans = await context.Database.BeginTransactionAsync();
        if (context.UserHasVotings.Any(x => x.Send == "no" && !x.VotedTime.HasValue))
        {
            foreach (var userHasVoting in await context.UserHasVotings
                .Where(x => x.Send == "no" && !x.VotedTime.HasValue).ToListAsync())
            {

                if (DateTime.UtcNow.Subtract(userHasVoting.Created).TotalMinutes <= 15)
                {
                    var uniqueKey = StringExtension.RandomString(250);
                    try
                    {
                        var voting = context.Votings.Single(x => x.MeetingId == userHasVoting.VotingMeetingId);
#if DEBUG
                        if (userHasVoting.User.Email.EndsWith("@example.com"))
                        {
                            continue;
                        }
#endif
                        await Send(userHasVoting.User, voting, uniqueKey);
                        userHasVoting.Send = "yes";
                        userHasVoting.UniqueKey = StringExtension.GetSHA256Hash(uniqueKey);
                        await context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        Logger.LogError(ex.Message, ex);
                    }
                }
                else
                {
                    userHasVoting.VotedTime = DateTime.UtcNow;
                    await context.SaveChangesAsync();
                }

            }
            await trans.CommitAsync();
        }

        await context.Database.CloseConnectionAsync();
        await trans.DisposeAsync();
        await context.DisposeAsync();
        Logger.LogInformation("La tarea programada se ejecutó en: " + DateTime.Now);

        await Task.CompletedTask;
    }
}
