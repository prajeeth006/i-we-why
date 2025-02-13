namespace Frontend.DeviceAtlas.Api.Infrastructure.Database;

internal interface IDbConnectionFactory
{
    string ConnectionString { get; }
}

internal sealed class DbConnectionFactory : IDbConnectionFactory
{
    public DbConnectionFactory(IConfiguration configuration)
    {
        ConnectionString = configuration.GetConnectionString("DeviceAtlas") ??
                           throw new Exception("Failed to find DeviceAtlas database connection string.");
    }

    public string ConnectionString { get; }
}
