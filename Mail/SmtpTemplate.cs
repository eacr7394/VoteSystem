namespace Mail;

public class SmtpTemplate
{
    public enum Template
    {
        VoteRequest
    }

    private Template templateName;
    private List<SmtpTemplateParameter> parameters;
    private List<LinkedResource> resources;
    private string body = null!;
    private string subject = null!;

    public SmtpTemplate(Template templateName)
    {
        this.templateName = templateName;
        parameters = new();
        resources = new();
    }

    internal void BuildBody()
    {
        switch (templateName)
        {
            case Template.VoteRequest:
                subject = VoteRequest.VoteRequestSubject;
                body = VoteRequest.VoteRequestBodyHtml;
                break;
            default: throw new ArgumentException(nameof(templateName));
        }

        parameters.ForEach((p) =>
        {
            body = body.Replace($"[{p.Name}]", p.Value);
        });
    }
    public void AddResources(byte[] resourceBytes, string contentId)
    {
        LinkedResource resource = new(new MemoryStream(resourceBytes));
        resource.ContentId = contentId;
        resources.Add(resource);
    }

    public void AddParameter(SmtpTemplateParameter parameter)
    {
        parameters.Add(parameter);
    }

    public string VoteRequestDomain { get; set; } = null!;
    public string Body => body;
    public string Subject => subject;
    public LinkedResource[] Resources => resources.ToArray();
}