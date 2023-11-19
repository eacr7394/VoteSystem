using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class User
{
    public string Id { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public DateTime Created { get; set; }

    public DateTime? Updated { get; set; }

    public string UnitId { get; set; } = null!;

    public virtual Unit Unit { get; set; } = null!;

    public virtual ICollection<UserHasVoting> UserHasVotings { get; set; } = new List<UserHasVoting>();
}
