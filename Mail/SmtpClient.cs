using System.Text;

namespace Mail;

public class SmtpClient
{
    private readonly MailAddress From;
    private readonly System.Net.Mail.SmtpClient Smtp;
    private readonly EmailConfiguration EmailConfiguration;

    public SmtpClient(IOptions<EmailConfiguration> option)
    {
        EmailConfiguration = option.Value;
        this.From = new MailAddress(EmailConfiguration.FromEmail);
        Smtp = new();
        Smtp.Host = EmailConfiguration.SmtpHost;
        Smtp.Port = EmailConfiguration.SmtpPort;
        Smtp.Credentials = new NetworkCredential(EmailConfiguration.SmtpUsername, EmailConfiguration.SmtpPassword);
        Smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
        Smtp.EnableSsl = true;
    }
    private void AddResources(SmtpTemplate template, MailMessage mailMessage)
    {
        template.VoteRequestDomain = EmailConfiguration.VoteRequestDomain;
        AlternateView alternateView = AlternateView.CreateAlternateViewFromString(template.Body, null, "text/html");

        foreach (var res in template.Resources)
        {
            alternateView.LinkedResources.Add(res);
            mailMessage.AlternateViews.Add(alternateView);
        }

        foreach (var attachment in template.Attachments)
        {
            mailMessage.Attachments.Add(attachment);
        }

    }
    public async Task SendAsync(string[] adminEmail, string[] bccEmails, SmtpTemplate template)
    {
        template.VoteRequestDomain = EmailConfiguration.VoteRequestDomain;
        template.BuildBody();
        MailAddress to = new(adminEmail[0]);
        MailMessage email = new(From, to);
        
        foreach (string cc in adminEmail)
        {
            email.To.Add(cc);
        }

        foreach (string bcc in bccEmails)
        {
            email.Bcc.Add(bcc);
        }
        email.Subject = template.Subject;
        email.Body = template.Body;
        email.IsBodyHtml = true;
        email.BodyEncoding = UTF8Encoding.UTF8;
        email.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
        AddResources(template, email);
        await Smtp.SendMailAsync(email);
    }

    public async Task SendAsync(string toEmail, SmtpTemplate template)
    {
        template.VoteRequestDomain = EmailConfiguration.VoteRequestDomain;
        template.BuildBody();
        MailAddress to = new(toEmail);
        MailMessage email = new(From, to);
        email.Subject = template.Subject;
        email.Body = template.Body;
        email.IsBodyHtml = true;
        email.BodyEncoding = UTF8Encoding.UTF8;
        email.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
        AddResources(template, email);
        await Smtp.SendMailAsync(email);
    }
}