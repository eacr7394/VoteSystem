namespace VotingSystemDatabase.Models;

public class DatabaseLoggerProvider : ILoggerProvider
{
    private readonly VoteSystemContext _dbContext;

    public DatabaseLoggerProvider(VoteSystemContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ILogger CreateLogger(string categoryName) =>
        new DatabaseLogger(_dbContext, categoryName);

    public void Dispose() { }
}
