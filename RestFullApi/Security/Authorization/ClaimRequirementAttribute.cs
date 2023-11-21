namespace RestFullApi.Security.Authorization;

public class ClaimRequirementAttribute : TypeFilterAttribute
{
    public ClaimRequirementAttribute(ClaimPermissionName name, ClaimPermissionValue value)
        : base(typeof(ClaimRequirementFilter))
    {
        Arguments = new[] { new Claim(name.ToString(), value.ToString()) };
    }
}
