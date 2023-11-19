using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Assistant
{
    public string Id { get; set; } = null!;

    public DateTime Created { get; set; }

    public string CanVote { get; set; } = null!;

    public string UnitId { get; set; } = null!;

    public virtual Unit Unit { get; set; } = null!;

    public virtual ICollection<UserHasVoting> UserHasVotings { get; set; } = new List<UserHasVoting>();
}
