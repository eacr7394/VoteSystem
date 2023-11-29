using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace JobSchedule;

public class SendUserVotingResultTask : IJob
{
    private SmtpClient SmtpClient { get; }
    private ILogger<SendUserVotingTask> Logger { get; }
    public SendUserVotingResultTask(ILogger<SendUserVotingTask> logger, IOptions<EmailConfiguration> emailConfOptions)
    {
        SmtpClient = new(emailConfOptions);
        Logger = logger;
    }

    private async Task<byte[]> BuildReport(Voting voting, int agreeCounter, int disagreeCounter, int abstentionCounter,
        int totalUnits)
    {
        VotingResultsSendUserVotingQuorumTask data = new VotingResultsSendUserVotingQuorumTask
        {
            VoteDescription = voting.Description,
            MeetingDate = voting.Meeting.Date,
            VotesInFavor = agreeCounter,
            VotesAgainst = disagreeCounter,
            Abstentions = abstentionCounter,
            QuorumRequirement = (int)Math.Round(totalUnits * 0.5 + 1),
            ExceptionQuorum = (int)Math.Round(totalUnits * 0.2),
            ActualAttendance = (agreeCounter + disagreeCounter + abstentionCounter),
            Results = new List<VotingResultSendUserVotingQuorumTask>()
        };

        foreach (var userVoting in voting.UserHasVotings)
        {
            var vote = new VotingResultSendUserVotingQuorumTask
            {
                Number = userVoting.User.Unit.Number,
                VotedAgainst = userVoting.Accepted == "no" ? "Sí" : "No",
                VotedInFavor = userVoting.Accepted == "yes" ? "Sí" : "No",
                Abstained = userVoting.Accepted == "" ? "Sí" : "No",
                VoteDate = userVoting.VotedTime
            };
            data.Results.Add(vote);
            userVoting.CloseTime = DateTime.UtcNow;
        }
        return await ExcelGeneratorSendUserVotingQuorumTask.GenerateExcelFile(data);
    }

    private async Task Send(Voting voting, string[] adminEmails, string[] bccEmails, int totalUnits)
    {
        int agreeCounter = voting.UserHasVotings.Count(x => x.Accepted == "yes");
        int disagreeCounter = voting.UserHasVotings.Count(x => x.Accepted == "no");
        int abstentionCounter = voting.UserHasVotings.Count(x => x.Accepted == "");
        byte[] votingResultExcell = await BuildReport(voting, agreeCounter, disagreeCounter, abstentionCounter, totalUnits);

        var template = new SmtpTemplate(SmtpTemplate.Template.VoteRequestAcknowledgmentResult);

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
            Name = "VOTOS_A_FAVOR",
            Value = agreeCounter.ToString(),
        });


        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "VOTOS_EN_CONTRA",
            Value = disagreeCounter.ToString(),
        });

        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "VOTOS_EN_ABSTENCION",
            Value = abstentionCounter.ToString(),
        });

        template.AddResources(VoteRequest.PhMonteBelloLogo, VoteRequest.PhMonteBelloLogoCid);

        template.AddAttachments(votingResultExcell, VoteRequest.VotingResultExcellCid, 
            $"Resultados-{voting.Description}-{voting.Meeting.Date.ToString("yyyy-MM-dd")}.xlsx", 
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        await SmtpClient.SendAsync(adminEmails, bccEmails, template);
    }

    public async Task Execute(IJobExecutionContext jobContext)
    {
        using var context = new VoteSystemContext();
        using var trans = await context.Database.BeginTransactionAsync();
        string[] adminEmails = await context.Admins.Select(x => x.Email).ToArrayAsync();
        List<string> bccUserEmails = await context.Users.Select(x => x.Email).ToListAsync();
        List<string> bccAssistantEmails = await context.Assistants.Where(x => !string.IsNullOrEmpty(x.EmailRepresent))
            .Select(x => x.EmailRepresent + "").ToListAsync();

        if (bccAssistantEmails.Count > 0)
        {
            bccUserEmails.AddRange(bccAssistantEmails);
        }

        string[] bccEmails = bccUserEmails.ToArray();

        int totalUnits = context.Units.Count();
#if DEBUG
        adminEmails = adminEmails.Where(x => !x.EndsWith("@example.com")).ToArray();
        bccEmails = bccEmails.Where(x => !x.EndsWith("@example.com")).ToArray();
#endif
        foreach (var voting in await context.Votings.Where(v => !v.UserHasVotings.Any(uhv => !uhv.VotedTime.HasValue) && v.UserHasVotings.Any()
        && !v.UserHasVotings.Any(uhv => uhv.CloseTime.HasValue)).ToListAsync())
        {
            try
            {
                await Send(voting, adminEmails, bccEmails, totalUnits);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
            }
        }

        await trans.CommitAsync();
        await context.Database.CloseConnectionAsync();
        await trans.DisposeAsync();
        await context.DisposeAsync();
        Logger.LogInformation("La tarea programada se ejecutó en: " + DateTime.Now);

        await Task.CompletedTask;
    }
}
