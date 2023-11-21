using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Permission
{
    public string ControllerName { get; set; } = null!;

    public string ControllerAction { get; set; } = null!;

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
