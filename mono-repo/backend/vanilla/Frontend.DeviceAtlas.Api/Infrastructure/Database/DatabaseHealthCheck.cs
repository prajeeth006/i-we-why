using Frontend.DeviceAtlas.Api.Application;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Frontend.DeviceAtlas.Api.Infrastructure.Database;

internal sealed class DatabaseHealthCheck : IHealthCheck
{
    private readonly IDbConnectionFactory connectionFactory;
    private readonly IDatabaseRepository databaseRepository;

    public DatabaseHealthCheck(IDbConnectionFactory connectionFactory, IDatabaseRepository databaseRepository)
    {
        this.connectionFactory = connectionFactory;
        this.databaseRepository = databaseRepository;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new ())
    {
        var data = new Dictionary<string, object> { ["ConnectionString"] = connectionFactory.ConnectionString };
        try
        {
            await databaseRepository.HealthCheckAsync(cancellationToken);
            return new HealthCheckResult(HealthStatus.Healthy, "CHECK_OK", null, data);
        }
        catch (Exception ex)
        {
            return new HealthCheckResult(HealthStatus.Unhealthy, "CHECK_FAILED", ex, data);
        }
    }
}
