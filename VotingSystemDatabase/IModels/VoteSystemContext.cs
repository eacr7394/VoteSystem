namespace VotingSystemDatabase.Models;

public partial class VoteSystemContext : DbContext
{

    private const string CONNECTION_STRING = $"Server=localhost;Port=3306;User=root;Password=4094;Database=vote_system;";
    private string ConnectionString { get; }
    
    public VoteSystemContext()
    {
        ConnectionString = CONNECTION_STRING;
        var conn = this.Database.GetDbConnection();
        conn.Open();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @$"set global net_buffer_length={int.MaxValue};set global max_allowed_packet={int.MaxValue};";
        cmd.ExecuteNonQuery();
    }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

        if (!optionsBuilder.IsConfigured)
        {

            var connectionString = ConnectionString;
            var serverVersion = ServerVersion.AutoDetect(connectionString);

            optionsBuilder
                .UseLazyLoadingProxies()
                .UseMySql(connectionString, serverVersion)
                .EnableThreadSafetyChecks()
                .ConfigureWarnings(warnings => warnings.Throw())
                .EnableDetailedErrors();

        }

    }

}
