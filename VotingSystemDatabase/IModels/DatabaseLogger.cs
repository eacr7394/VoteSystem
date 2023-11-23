namespace VotingSystemDatabase.Models;

public class DatabaseLogger : ILogger
{
    private readonly string _categoryName;

    public DatabaseLogger(string categoryName)
    {
        _categoryName = categoryName;
    }

    public IDisposable? BeginScope<TState>(TState state) where TState : notnull
    {
        return null!;
    }

    public bool IsEnabled(LogLevel logLevel) =>
        logLevel == LogLevel.Information || logLevel == LogLevel.Error;

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        if (!IsEnabled(logLevel))
            return;

        var logEntry = new LogEntry
        {
            LogLevel = logLevel.ToString(),
            Category = _categoryName,
            Message = formatter(state, exception),
            CreatedAt = DateTime.UtcNow
        };
        using var context = new VoteSystemContext();
        using var trans = context.Database.BeginTransaction();
        context.LogEntries.Add(logEntry);
        context.SaveChanges();
        trans.Commit();
        trans.Dispose();
        context.Database.CloseConnection();
        context.Dispose();
    }

}