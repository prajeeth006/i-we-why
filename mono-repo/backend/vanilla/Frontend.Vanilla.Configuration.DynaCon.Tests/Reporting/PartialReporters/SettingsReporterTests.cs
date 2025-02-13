using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public sealed class SettingsReporterTests : PartialConfigurationReporterTestsBase
{
    private IConfigurationInfo configInfo1;
    private IConfigurationInfo configInfo2;
    private DynaConEngineSettings engineSettings;
    private TenantSettings tenantSettings;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        configInfo1 = Mock.Of<IConfigurationInfo>();
        configInfo2 = Mock.Of<IConfigurationInfo>();
        engineSettings = Settings.Build();
        tenantSettings = TestSettings.GetTenant();
        getTarget = s => new SettingsReporter(engineSettings, tenantSettings, new[] { configInfo1, configInfo2 });
    }

    [Fact]
    public void ShouldFillSettings()
    {
        FillReport(); // Act

        Report.Settings.Engine.Should().BeSameAs(engineSettings);
        Report.Settings.CurrentTenant.Should().BeSameAs(tenantSettings);
        Report.FeaturesMetadata.Should().BeEquivalentTo(new[] { configInfo1, configInfo2 });
    }
}
