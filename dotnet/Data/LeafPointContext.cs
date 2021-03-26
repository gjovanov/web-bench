using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
  public class LeafPointContext : DbContext
  {
    internal const string DefaultDatabaseName = "LeafPointDB";

    public LeafPointContext(DbContextOptions<LeafPointContext> options)
            : base(options)
    {
      
    }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      modelBuilder.ApplyConfiguration(new UserConfiguration());
    }
  }
}