using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Voting
{
    public string Id { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string MeetingId { get; set; } = null!;

    public string MeetingAdminId { get; set; } = null!;

    public virtual Meeting Meeting { get; set; } = null!;

    public virtual ICollection<UserHasVoting> UserHasVotings { get; set; } = new List<UserHasVoting>();
}
