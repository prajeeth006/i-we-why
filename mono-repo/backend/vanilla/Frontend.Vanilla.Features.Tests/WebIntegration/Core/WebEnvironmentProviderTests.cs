using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core;

public class WebEnvironmentProviderTests
{
    private Mock<IEnvironmentNameProvider> environmentNameProvider;
    private Mock<ICurrentTenantResolver> currentTenantResolver;
    private Mock<ISingleDomainAppConfiguration> singleDomainAppConfig;

    public WebEnvironmentProviderTests()
    {
        environmentNameProvider = new Mock<IEnvironmentNameProvider>();
        currentTenantResolver = new Mock<ICurrentTenantResolver>();
        singleDomainAppConfig = new Mock<ISingleDomainAppConfiguration>();
    }

    private IEnvironmentProvider GetTarget()
        => new WebEnvironmentProvider(currentTenantResolver.Object, environmentNameProvider.Object, singleDomainAppConfig.Object);

    [Fact]
    public void Environment_ShouldTakeOnceFromProviderOne()
    {
        environmentNameProvider.SetupGet(p => p.EnvironmentName).Returns("lol");
        var target = GetTarget();

        // Act
        target.Environment.Should().Be("lol");

        // Should be immutable
        environmentNameProvider.SetupGet(p => p.EnvironmentName).Returns("omg");
        target.Environment.Should().Be("lol");
    }

    [Theory, BooleanData]
    public void Environment_ShouldTakeOnceFromProvider(bool value)
    {
        environmentNameProvider.SetupGet(p => p.IsProduction).Returns(value);
        var target = GetTarget();

        // Act
        target.IsProduction.Should().Be(value);

        // Should be immutable
        environmentNameProvider.SetupGet(p => p.IsProduction).Returns(!value);
        target.IsProduction.Should().Be(value);
    }

    [Theory, BooleanData]
    public void IsSingleDomainApp_ShouldTakeOnceFromProvider(bool value)
    {
        singleDomainAppConfig.Setup(p => p.IsEnabled()).Returns(value);
        var target = GetTarget();

        // Act
        target.IsSingleDomainApp.Should().Be(value);

        // Should be immutable
        singleDomainAppConfig.Setup(p => p.IsEnabled()).Returns(!value);
        target.IsSingleDomainApp.Should().Be(value);
    }

    [Fact]
    public void CurrentLabel_ShouldDelegateInRuntime()
    {
        currentTenantResolver.Setup(p => p.ResolveName()).Returns("bwin.com");
        var target = GetTarget();

        // Act
        target.CurrentLabel.Should().Be("bwin.com");

        // Should be mutable
        currentTenantResolver.Setup(p => p.ResolveName()).Returns("party.net");
        target.CurrentLabel.Should().Be("party.net");
    }
}
