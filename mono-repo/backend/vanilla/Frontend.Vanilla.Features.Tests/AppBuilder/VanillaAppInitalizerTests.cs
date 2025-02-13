using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Features.AppBuilder;
using Frontend.Vanilla.Features.Ioc;
using Moq;
using Serilog;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.AppBuilder;

public sealed class VanillaAppInitializerTests
{
    private readonly Mock<ILogger> log;
    private readonly Mock<IConfigurationInitializer> configInitializer;
    private readonly Mock<IBootTaskExecutor> bootTaskExecutor;

    public VanillaAppInitializerTests()
    {
        configInitializer = new Mock<IConfigurationInitializer>();
        bootTaskExecutor = new Mock<IBootTaskExecutor>();

        log = new Mock<ILogger>();
    }

    private VanillaAppInitializer GetTarget()
        => new VanillaAppInitializer(configInitializer.Object, bootTaskExecutor.Object);

    [Fact]
    public async Task ShouldInitializeServices()
    {
        // Act
        await GetTarget().InitializeAsync(log.Object);

        configInitializer.Verify(o => o.Initialize());
        bootTaskExecutor.Verify(t => t.ExecuteTasksAsync());

        log.Verify(l => l.Information("Initializing DynaCon configuration..."));
        log.Verify(l => l.Information("Initializing boot tasks..."));
        log.VerifyNoOtherCalls();
    }
}
