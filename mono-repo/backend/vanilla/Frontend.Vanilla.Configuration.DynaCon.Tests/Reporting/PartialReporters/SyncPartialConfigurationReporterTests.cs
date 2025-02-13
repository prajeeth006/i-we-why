using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public class SyncPartialConfigurationReporterTests
{
    [Fact]
    public async Task ShouldCallSyncMethod()
    {
        var underlyingMock = new Mock<SyncPartialConfigurationReporter>();
        IPartialConfigurationReporter target = underlyingMock.Object;

        var report = new ConfigurationReport();
        var snapshot = Mock.Of<IConfigurationSnapshot>();

        // Act
        await target.FillAsync(report, snapshot, TestContext.Current.CancellationToken);

        underlyingMock.Verify(m => m.Fill(report, snapshot));
    }
}
