using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Role
{
    public string Id { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<Admin> Admins { get; set; } = new List<Admin>();

    public virtual ICollection<Permission> PermissionControllers { get; set; } = new List<Permission>();
}
