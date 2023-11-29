namespace RestFullApi.Controllers;

public class BaseController<T> : ControllerBase, IDisposable
    where T : ControllerBase
{
    protected VoteSystemContext VSContext { get; }
    private IDbContextTransaction Transaction { get; }
    protected ILogger<T> Logger { get; }
    private JsonSerializerSettings JsonOptions { get; }

    public BaseController(ILogger<T> logger)
    {
        VSContext = new();
        Transaction = VSContext.Database.BeginTransaction();
        Logger = logger;
        JsonOptions = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        };
    }

    public void Dispose()
    {
        Transaction.Commit();
        VSContext.Database.CloseConnection();
        Transaction.Dispose();
        VSContext.Dispose();
    }

    protected string Serialize(object obj)
    {
        return JsonConvert.SerializeObject(obj, JsonOptions);
    }

    protected O DeserializeObject<O>(string json)
        where O : new()
    {
        return JsonConvert.DeserializeObject<O>(json, JsonOptions)!;
    }
}
