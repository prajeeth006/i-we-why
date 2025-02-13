using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Features.Ioc;
using Serilog;

namespace Frontend.Vanilla.Features.AppBuilder;

internal sealed class VanillaAppInitializer(
    IConfigurationInitializer configInitializer,
    IBootTaskExecutor bootTaskExecutor)
{
    public async Task InitializeAsync(ILogger log)
    {
        log.Information("Initializing DynaCon configuration...");
        configInitializer.Initialize();

        log.Information("Initializing boot tasks...");
        await bootTaskExecutor.ExecuteTasksAsync();
    }
}
