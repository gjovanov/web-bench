using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet.Data
{
  public class UserConfiguration : IEntityTypeConfiguration<User>
  {
      public void Configure(EntityTypeBuilder<User> builder)
      {
          builder.Property(x => x.Id).HasColumnName("UserId");
          builder.Property(x => x.FirstName).IsRequired().HasMaxLength(50);
          builder.Property(x => x.LastName).IsRequired().HasMaxLength(35);
          builder.Property(x => x.UserName).IsRequired().HasMaxLength(25);

          builder.ToTable("User", "auth");
      }
  }
}