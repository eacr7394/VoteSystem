using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class LogEntry
{
    public int Id { get; set; }

    public string LogLevel { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
