using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace JobSchedule;

public class SendUserVotingQuorumTask : IJob
{
    private SmtpClient SmtpClient { get; }
    private ILogger<SendUserVotingTask> Logger { get; }
    public SendUserVotingQuorumTask(ILogger<SendUserVotingTask> logger, IOptions<EmailConfiguration> emailConfOptions)
    {
        SmtpClient = new(emailConfOptions);
        Logger = logger;
    }

    private async Task<byte[]> BuildReport(List<Assistant> assistants, Meeting meeting, int totalUnits)
    {
        QuorumResultsVoteRequestQuorumNewOwner data = new QuorumResultsVoteRequestQuorumNewOwner
        {
            MeetingDate = meeting.Date,
            QuorumRequirement = (int)Math.Round(totalUnits * 0.5 + 1),
            ExceptionQuorum = (int)Math.Round(totalUnits * 0.2),
            ActualAttendance = assistants.Count,
            Results = new List<QuorumResultVoteRequestQuorumNewOwner>()
        };

        foreach (var assistant in assistants)
        {
            if (!assistant.QuorumDate.HasValue)
            {
                assistant.QuorumDate = DateTime.UtcNow;
            }
            var quorum = new QuorumResultVoteRequestQuorumNewOwner
            {
                Number = assistant.Unit.Number,
                MeetingDate = meeting.Date,
                QuorumDate = assistant.QuorumDate
            };
            data.Results.Add(quorum);
        }
        return await ExcelGeneratorVoteRequestQuorumNewOwner.GenerateExcelFile(data);
    }

    private async Task Send(List<Assistant> assistant, Meeting meeting, string[] adminEmails, string[] bccEmails, int totalUnits)
    {
        double assistancePercentage = 0;
        if (assistant.Count >= 1)
        {
            assistancePercentage = Math.Round((double)assistant.Count / totalUnits * 100, 2);
        }

        var template = new SmtpTemplate(SmtpTemplate.Template.VoteRequestQuorumNewOwner);

        template.AddParameter(new SmtpTemplateParameter
        {
            Name = "PORCENTAJE_ASISTENCIA",
            Value = assistancePercentage.ToString(),
        });

        if (DateTime.UtcNow.Subtract(meeting.Assistants.First().Created).TotalMinutes < 60)
        {
            template.AddParameter(new SmtpTemplateParameter
            {
                Name = "QUORUM_TYPE_PERCENTAGE",
                Value = "51",
            });
            template.AddParameter(new SmtpTemplateParameter
            {
                Name = "QUORUM_TYPE",
                Value = "Reglamentario",
            });
        }
        else
        {
            template.AddParameter(new SmtpTemplateParameter
            {
                Name = "QUORUM_TYPE_PERCENTAGE",
                Value = "20",
            });
            template.AddParameter(new SmtpTemplateParameter
            {
                Name = "QUORUM_TYPE",
                Value = "de Excepción (Ley 284, Art. 67)",
            });
        }

        byte[] votingResultExcell = await BuildReport(assistant, meeting, totalUnits);


        template.AddResources(VoteRequest.PhMonteBelloLogo, VoteRequest.PhMonteBelloLogoCid);

        template.AddAttachments(votingResultExcell, VoteRequest.VotingQuorumExcellCid,
            $"Resultados-Quorum-Asamblea-{meeting.Date.ToString("yyyy-MM-dd")}.xlsx",
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

        if(bccAssistantEmails.Count > 0)
        {
            bccUserEmails.AddRange(bccAssistantEmails);
        }

        string[] bccEmails = bccUserEmails.ToArray();

        int totalUnits = context.Units.Count();
#if DEBUG
        adminEmails = adminEmails.Where(x => !x.EndsWith("@example.com")).ToArray();
        bccEmails = bccEmails.Where(x => !x.EndsWith("@example.com")).ToArray();
#endif
        foreach (var meeting in await context.Meetings.Where(v => v.Assistants.Any(x => !x.QuorumDate.HasValue)).ToListAsync())
        {
            try
            {
                var assistants = await context.Assistants.Where(v => v.MeetingId == meeting.Id).ToListAsync();
                await Send(assistants, meeting, adminEmails, bccEmails, totalUnits);
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
