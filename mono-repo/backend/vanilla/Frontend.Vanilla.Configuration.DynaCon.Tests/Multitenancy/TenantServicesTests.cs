using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class TenantServicesTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var initializer = Mock.Of<IConfigurationInitializer>();
        var changesetResolver = Mock.Of<ICurrentChangesetResolver>();
        var reporter = Mock.Of<IConfigurationReporter>();
        var overridesService = Mock.Of<IConfigurationOverridesService>();

        // Act
        var target = new TenantServices(initializer, changesetResolver, reporter, overridesService);

        target.Initializer.Should().BeSameAs(initializer);
        target.ChangesetResolver.Should().BeSameAs(changesetResolver);
        target.Reporter.Should().BeSameAs(reporter);
        target.OverridesService.Should().BeSameAs(overridesService);
    }
}
