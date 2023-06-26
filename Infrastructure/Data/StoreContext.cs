using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class StoreContext : DbContext
{
    public StoreContext(DbContextOptions<StoreContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductBrand> ProductBrands { get; set; }
    public DbSet<ProductType> ProductTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            modelBuilder.Model.GetEntityTypes()
            .SelectMany(entityType => entityType.ClrType.GetProperties()
                .Where(x => x.PropertyType == typeof(decimal))
                .Select(property => new KeyValuePair<string, string>(entityType.Name, property.Name)))
                .ToList()
                .ForEach(x => modelBuilder
                        .Entity(x.Key).Property(x.Value).HasConversion<double>());
        }
    }
}
