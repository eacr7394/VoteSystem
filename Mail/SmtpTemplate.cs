namespace Mail;

public class SmtpTemplate
{
    public enum Template
    {
        VoteRequest,
        VoteRequestAcknowledgment,
        VoteRequestAcknowledgmentResult,
        VoteRequestQuorumNewOwner,
        VoteRequestChangePassword
    }

    private Template templateName;
    private List<SmtpTemplateParameter> parameters;
    private List<LinkedResource> resources;
    private List<Attachment> attachments;
    private string body = null!;
    private string subject = null!;

    public SmtpTemplate(Template templateName)
    {
        this.templateName = templateName;
        parameters = new();
        resources = new();
        attachments = new();
    }

    internal void BuildBody()
    {
        switch (templateName)
        {
            case Template.VoteRequest:
                subject = $"{parameters.First(x => x.Name == "DESCRIPCION_VOTACION").Value} - {VoteRequest.VoteRequestSubject}";
                body = VoteRequest.VoteRequestBodyHtml;
                break;

            case Template.VoteRequestAcknowledgment:
                subject = $"{parameters.First(x => x.Name == "DESCRIPCION_VOTACION").Value} - {VoteRequest.VoteRequestAcknowledgmentSubject}";
                body = VoteRequest.VoteRequestAcknowledgmentBodyHtml;
                break;

            case Template.VoteRequestAcknowledgmentResult:
                subject = $"{parameters.First(x => x.Name == "DESCRIPCION_VOTACION").Value} - {VoteRequest.VoteRequestAcknowledgmentResultSubject}";
                body = VoteRequest.VoteRequestAcknowledgmentResultBodyHtml;
                break;

            case Template.VoteRequestQuorumNewOwner:
                subject = VoteRequest.VoteRequestQuorumNewOwnerSubject;
                body = VoteRequest.VoteRequestQuorumNewOwnerBodyHtml;
                break;

            case Template.VoteRequestChangePassword:
                subject = VoteRequest.VoteRequestChangePasswordSubject;
                body = VoteRequest.VoteRequestChangePasswordBodyHtml;
                break;

            default: throw new ArgumentException(nameof(templateName));
        }
        body = body.Replace("[VOTE_REQUEST_DOMAIN]", VoteRequestDomain);
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
    public void AddAttachments(byte[] attachmentBytes, string contentId, string fileName, string contentType)
    {
        Attachment attachment = new(new MemoryStream(attachmentBytes), fileName, contentType);
        attachment.ContentId = contentId;
        attachments.Add(attachment);
    }

    public void AddParameter(SmtpTemplateParameter parameter)
    {
        parameters.Add(parameter);
    }

    public string VoteRequestDomain { get; set; } = null!;
    public string Body => body;
    public string Subject => subject;
    public LinkedResource[] Resources => resources.ToArray();
    public Attachment[] Attachments => attachments.ToArray();
}