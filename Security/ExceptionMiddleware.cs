namespace Security;

public class ExceptionMiddleware
{
    private readonly RequestDelegate next;
    private ILogger<ExceptionMiddleware> logger;
    private string ipAddress;

    public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, RequestDelegate next)
    {
        this.next = next;
        this.logger = logger;
        ipAddress = string.Empty;
    }

    private string BuildHeader(HttpContext context)
    {
        var head = @$"Start:::: IpAddress::: {ipAddress = GetClientIpAddress(context)}";
        head += @$":::Method: {context.Request.Method}";
        head += @$":::Path: {context.Request.Path}";
        return head;
    }

    private string BuildFooter(HttpContext context)
    {
        var head = @$"End:::: IpAddress::: {ipAddress}";
        head += @$":::Method: {context.Request.Method}";
        head += @$":::Path: {context.Request.Path}";
        return head;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            logger.BeginScope(null!);
            try
            {
                logger.LogInformation(BuildHeader(context));
                await next(context);
                logger.LogInformation(BuildFooter(context));
            }
            catch (Exception ex)
            {
                logger.LogError($"IpAddress:::: {ipAddress} :::Message::: {ex.Message}", ex);
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(JsonConvert.SerializeObject(new
                {
                    error = "An unexpected error occurred."
                }));
            }
        }
        catch (Exception ex)
        {
            File.AppendAllText("fatal-error.info", ex.Message);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonConvert.SerializeObject(new
            {
                error = "An unexpected error occurred."
            }));
        }
    }
}
