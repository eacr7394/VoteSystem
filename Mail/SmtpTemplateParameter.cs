namespace Mail;

public class SmtpTemplateParameter
{
    private string name = null!;
    private string value = null!;

    public string Name { get => name; set { name = value; } }
    public string Value { get => value; set { this.value = value; } }
}