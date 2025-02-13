using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Moq;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public abstract class PartialConfigurationReporterTestsBase
{
    private Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget;
    protected DynaConEngineSettingsBuilder Settings { get; private set; }
    internal ConfigurationReport Report { get; private set; }
    internal Mock<IConfigurationSnapshot> Snapshot { get; private set; }
    protected CancellationToken Ct { get; private set; }

    public PartialConfigurationReporterTestsBase()
    {
        Settings = new DynaConEngineSettingsBuilder(TestSettings.GetParameter());
        Report = new ConfigurationReport();
        Snapshot = new Mock<IConfigurationSnapshot> { DefaultValue = DefaultValue.Mock };
        Ct = TestCancellationToken.Get();
        Setup(out getTarget);
    }

    internal abstract void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget);

    protected async Task FillReportAsync()
    {
        var target = getTarget(Settings.Build());
        await target.FillAsync(Report, Snapshot.Object, Ct);
    }

    protected void FillReport()
    {
        var target = (SyncPartialConfigurationReporter)getTarget(Settings.Build());
        target.Fill(Report, Snapshot.Object);
    }
}
