using Frontend.DeviceAtlas.Api.Application;
using Frontend.DeviceAtlas.Api.Infrastructure.Database;

namespace Frontend.DeviceAtlas.Api.Infrastructure;

internal static class InfrastructureServices
{
    public static void AddInfrastructure(this IServiceCollection services)
    {
        // database
        services.AddSingleton<IDbConnectionProvider, DbConnectionProvider>();
        services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
        services.AddSingleton<IDatabaseRepository, DatabaseRepository>();
        services.AddHealthChecks().AddCheck<DatabaseHealthCheck>("Database");
    }
}
