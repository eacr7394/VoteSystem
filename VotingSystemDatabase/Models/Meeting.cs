using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Meeting
{
    public string Id { get; set; } = null!;

    public DateOnly Date { get; set; }

    public string AdminId { get; set; } = null!;

    public virtual Admin Admin { get; set; } = null!;

    public virtual ICollection<Voting> Votings { get; set; } = new List<Voting>();
}
