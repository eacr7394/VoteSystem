using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VotingSystemDatabase.Models;

public partial class VoteSystemContext : DbContext
{
    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Assistant> Assistants { get; set; }

    public virtual DbSet<Meeting> Meetings { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserHasVoting> UserHasVotings { get; set; }

    public virtual DbSet<Voting> Votings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb3_general_ci")
            .HasCharSet("utf8mb3");

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("admin");

            entity.HasIndex(e => e.Email, "email_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Username, "username_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(350)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(256)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(45)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Assistant>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.UnitId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("assistant");

            entity.HasIndex(e => e.UnitId, "fk_assistant_unit1_idx");

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("id");
            entity.Property(e => e.UnitId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("unit_id");
            entity.Property(e => e.CanVote)
                .HasColumnType("enum('yes','no')")
                .HasColumnName("can_vote");
            entity.Property(e => e.Created)
                .HasColumnType("datetime")
                .HasColumnName("created");

            entity.HasOne(d => d.Unit).WithMany(p => p.Assistants)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_assistant_unit1");
        });

        modelBuilder.Entity<Meeting>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.AdminId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("meeting");

            entity.HasIndex(e => e.AdminId, "fk_meeting_admin1_idx");

            entity.Property(e => e.Id)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("id");
            entity.Property(e => e.AdminId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("admin_id");
            entity.Property(e => e.Date).HasColumnName("date");

            entity.HasOne(d => d.Admin).WithMany(p => p.Meetings)
                .HasForeignKey(d => d.AdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_meeting_admin1");
        });

        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("unit");

            entity.HasIndex(e => e.Id, "id_UNIQUE").IsUnique();

            entity.HasIndex(e => e.Number, "number_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("id");
            entity.Property(e => e.Number).HasColumnName("number");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.UnitId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("user");

            entity.HasIndex(e => e.Email, "email_UNIQUE").IsUnique();

            entity.HasIndex(e => e.UnitId, "fk_user_unit_idx");

            entity.HasIndex(e => e.Id, "iduser_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("id");
            entity.Property(e => e.UnitId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("unit_id");
            entity.Property(e => e.Created)
                .HasColumnType("datetime")
                .HasColumnName("created");
            entity.Property(e => e.Email)
                .HasMaxLength(250)
                .HasColumnName("email");
            entity.Property(e => e.Lastname)
                .HasMaxLength(45)
                .HasColumnName("lastname");
            entity.Property(e => e.Name)
                .HasMaxLength(45)
                .HasColumnName("name");
            entity.Property(e => e.Updated)
                .HasColumnType("datetime")
                .HasColumnName("updated");

            entity.HasOne(d => d.Unit).WithMany(p => p.Users)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_unit");
        });

        modelBuilder.Entity<UserHasVoting>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.UserUnitId, e.AssistantId, e.AssistantUnitId, e.VotingId, e.VotingMeetingId, e.VotingMeetingAdminId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0, 0, 0, 0, 0 });

            entity.ToTable("user_has_voting");

            entity.HasIndex(e => new { e.AssistantId, e.AssistantUnitId }, "fk_user_has_voting_assistant1_idx");

            entity.HasIndex(e => new { e.VotingId, e.VotingMeetingId, e.VotingMeetingAdminId }, "fk_user_has_voting_voting1_idx");

            entity.Property(e => e.UserId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("user_id");
            entity.Property(e => e.UserUnitId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("user_unit_id");
            entity.Property(e => e.AssistantId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("assistant_id");
            entity.Property(e => e.AssistantUnitId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("assistant_unit_id");
            entity.Property(e => e.VotingId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("voting_id");
            entity.Property(e => e.VotingMeetingId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("voting_meeting_id");
            entity.Property(e => e.VotingMeetingAdminId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("voting_meeting_admin_id");
            entity.Property(e => e.Accepted)
                .HasColumnType("enum('yes','no')")
                .HasColumnName("accepted");
            entity.Property(e => e.Created)
                .HasColumnType("datetime")
                .HasColumnName("created");
            entity.Property(e => e.Send)
                .HasColumnType("enum('yes','no')")
                .HasColumnName("send");
            entity.Property(e => e.UniqueKey)
                .HasMaxLength(256)
                .HasColumnName("unique_key");
            entity.Property(e => e.VotedTime)
                .HasColumnType("datetime")
                .HasColumnName("voted_time");

            entity.HasOne(d => d.Assistant).WithMany(p => p.UserHasVotings)
                .HasForeignKey(d => new { d.AssistantId, d.AssistantUnitId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_has_voting_assistant1");

            entity.HasOne(d => d.User).WithMany(p => p.UserHasVotings)
                .HasForeignKey(d => new { d.UserId, d.UserUnitId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_has_voting_user1");

            entity.HasOne(d => d.Voting).WithMany(p => p.UserHasVotings)
                .HasForeignKey(d => new { d.VotingId, d.VotingMeetingId, d.VotingMeetingAdminId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_has_voting_voting1");
        });

        modelBuilder.Entity<Voting>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.MeetingId, e.MeetingAdminId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0 });

            entity.ToTable("voting");

            entity.HasIndex(e => new { e.MeetingId, e.MeetingAdminId }, "fk_voting_meeting1_idx");

            entity.Property(e => e.Id)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("id");
            entity.Property(e => e.MeetingId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("meeting_id");
            entity.Property(e => e.MeetingAdminId)
                .HasMaxLength(38)
                .IsFixedLength()
                .HasColumnName("meeting_admin_id");
            entity.Property(e => e.Description)
                .HasMaxLength(250)
                .HasColumnName("description");

            entity.HasOne(d => d.Meeting).WithMany(p => p.Votings)
                .HasForeignKey(d => new { d.MeetingId, d.MeetingAdminId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_voting_meeting1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
