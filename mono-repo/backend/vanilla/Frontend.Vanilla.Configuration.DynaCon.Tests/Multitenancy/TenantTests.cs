using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class TenantTests
{
    private ITenant target;
    private ICurrentChangesetResolver changesetResolver;
    private IConfigurationReporter reporter;
    private IConfigurationOverridesService overridesService;
    private UtcDateTime startTime;
    private IDisposable serviceScope;

    public TenantTests()
    {
        changesetResolver = Mock.Of<ICurrentChangesetResolver>();
        reporter = Mock.Of<IConfigurationReporter>();
        overridesService = Mock.Of<IConfigurationOverridesService>();
        startTime = TestTime.GetRandomUtc();
        serviceScope = Mock.Of<IDisposable>();
        target = new Tenant(changesetResolver, reporter, overridesService, startTime, serviceScope);
    }

    [Fact]
    public void ShouldCreateCorrectly()
    {
        target.ChangesetResolver.Should().BeSameAs(changesetResolver);
        target.Reporter.Should().BeSameAs(reporter);
        target.OverridesService.Should().BeSameAs(overridesService);
        target.StartTime.Should().Be(startTime);
        target.LastAccessTime.Should().Be(default);
        target.AccessCount.Should().Be(0L);
        target.ServiceScope.Should().BeSameAs(serviceScope);
    }

    [Fact]
    public void ShouldAllowSettingAccessTime()
    {
        var accessTime = TestTime.GetRandomUtc();

        // Act
        target.LastAccessTime = accessTime;

        target.LastAccessTime.Should().Be(accessTime);
        target.AccessCount.Should().Be(1);
    }
}
