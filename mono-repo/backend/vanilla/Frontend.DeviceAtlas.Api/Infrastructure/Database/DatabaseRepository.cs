using System.Data;
using Dapper;
using Frontend.DeviceAtlas.Api.Application;

namespace Frontend.DeviceAtlas.Api.Infrastructure.Database;

internal class DatabaseRepository : IDatabaseRepository
{
    private readonly IDbConnectionProvider connectionProvider;

    public DatabaseRepository(IDbConnectionProvider connectionProvider)
    {
        this.connectionProvider = connectionProvider;
    }

    public async Task<int> HealthCheckAsync(CancellationToken cancellationToken)
    {
        using var connection = connectionProvider.Get();
        return await connection.QueryFirstOrDefaultAsync<int>(new CommandDefinition("[dbo].[proc_health_check]", commandType: CommandType.StoredProcedure, cancellationToken: cancellationToken));
    }

    public async Task<string> GetDeviceAtlasAsync(CancellationToken cancellationToken)
    {
        using var connection = connectionProvider.Get();
        return await connection.QueryFirstAsync<string>(new CommandDefinition("[dbo].[proc_devatlas_get]", commandType: CommandType.StoredProcedure, cancellationToken: cancellationToken));
    }
}
