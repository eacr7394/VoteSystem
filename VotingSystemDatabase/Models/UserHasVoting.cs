using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class UserHasVoting
{
    public string Accepted { get; set; } = null!;

    public DateTime? VotedTime { get; set; }

    public DateTime Created { get; set; }

    public string UniqueKey { get; set; } = null!;

    public string Send { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string UserUnitId { get; set; } = null!;

    public string VotingId { get; set; } = null!;

    public string VotingMeetingId { get; set; } = null!;

    public string VotingMeetingAdminId { get; set; } = null!;

    public string AssistantId { get; set; } = null!;

    public string AssistantUnitId { get; set; } = null!;

    public string AssistantMeetingId { get; set; } = null!;

    public string AssistantMeetingAdminId { get; set; } = null!;

    public virtual Assistant Assistant { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual Voting Voting { get; set; } = null!;
}
