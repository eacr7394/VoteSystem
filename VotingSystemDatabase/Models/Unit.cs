using System;
using System.Collections.Generic;

namespace VotingSystemDatabase.Models;

public partial class Unit
{
    public string Id { get; set; } = null!;

    public int Number { get; set; }

    public virtual ICollection<Assistant> Assistants { get; set; } = new List<Assistant>();

    public virtual User? User { get; set; }
}
