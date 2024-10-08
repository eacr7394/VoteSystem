﻿using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Admin
{
    public string Id { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int BlockCounter { get; set; }

    public DateTime? BlockedTime { get; set; }

    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();

    public virtual ICollection<PasswordRecoveryRequest> PasswordRecoveryRequests { get; set; } = new List<PasswordRecoveryRequest>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
