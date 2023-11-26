using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class PasswordRecoveryRequest
{
    public string Id { get; set; } = null!;

    public string AdminId { get; set; } = null!;

    public string UniqueKey { get; set; } = null!;

    public bool Used { get; set; }

    public DateTime? PasswordChangeDate { get; set; }

    public DateTime Created { get; set; }

    public virtual Admin Admin { get; set; } = null!;
}
