namespace Mail;
public class EmailConfiguration
{
    public string VoteRequestDomain { get; set; } = null!;
    public string FromEmail { get; set; } = null!;
    public string SmtpHost { get; set; } = null!;
    public string SmtpUsername { get; set; } = null!;
    public string SmtpPassword { get; set; } = null!;
    public int SmtpPort { get; set; }
}
