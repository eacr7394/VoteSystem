namespace VotingSystemDatabase.Models;

public class DatabaseLoggerProvider : ILoggerProvider
{
    public ILogger CreateLogger(string categoryName) =>
        new DatabaseLogger(categoryName);

    public void Dispose() { }
}
