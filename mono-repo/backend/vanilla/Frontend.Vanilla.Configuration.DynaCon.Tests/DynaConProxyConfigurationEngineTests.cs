using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public sealed class DynaConProxyConfigurationEngineTests
{
    private readonly IConfigurationEngine target;

    private readonly IFooConfiguration fooProxy;
    private readonly IBarConfiguration barProxy;
    private readonly Mock<IFooConfiguration> currentFooConfig;
    private readonly Mock<IBarConfiguration> currentBarConfig;

    public DynaConProxyConfigurationEngineTests()
    {
        var currentConfigResolver = new Mock<ICurrentConfigurationResolver>();
        var fooInfo = Mock.Of<IConfigurationInfo>(i => i.ServiceType == typeof(IFooConfiguration) && i.FeatureName == "Vanilla.Foo");
        var barInfo = Mock.Of<IConfigurationInfo>(i => i.ServiceType == typeof(IBarConfiguration) && i.FeatureName == "Vanilla.Bar");
        target = new DynaConProxyConfigurationEngine(currentConfigResolver.Object, new[] { fooInfo, barInfo });

        currentFooConfig = new Mock<IFooConfiguration>();
        currentBarConfig = new Mock<IBarConfiguration>();

        currentConfigResolver.Setup(r => r.Resolve("Vanilla.Foo", It.IsAny<bool>())).Returns(currentFooConfig.Object);
        currentConfigResolver.Setup(r => r.Resolve("Vanilla.Bar", It.IsAny<bool>())).Returns(currentBarConfig.Object);

        // Act
        fooProxy = (IFooConfiguration)target.CreateConfiguration(fooInfo);
        barProxy = (IBarConfiguration)target.CreateConfiguration(barInfo);
    }

    [Fact]
    public void ShouldCallConfigProperty()
    {
        currentFooConfig.SetupGet(c => c.Value).Returns("bwin");

        fooProxy.Value.Should().Be("bwin"); // Act
    }

    [Fact]
    public void ShouldCallConfigMethod()
    {
        currentFooConfig.Setup(c => c.Calculate(123, "test")).Returns(666);

        fooProxy.Calculate(123, "test").Should().Be(666); // Act
    }

    [Fact]
    public void ShouldThrow_IfAccessToDisabledConfig()
    {
        currentBarConfig.SetupGet(c => c.Value).Returns(123);

        // Act
        barProxy.IsEnabled.Should().BeFalse();
        barProxy.Invoking(c => c.Value).Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void ShouldPass_IfAccessEnabled()
    {
        currentBarConfig.SetupGet(c => c.IsEnabled).Returns(true);
        currentBarConfig.SetupGet(c => c.Value).Returns(123);

        // Act
        barProxy.IsEnabled.Should().BeTrue();
        barProxy.Value.Should().Be(123);
    }

    public interface IFooConfiguration
    {
        string Value { get; }
        int Calculate(int number, string str);
    }

    public interface IBarConfiguration : IDisableableConfiguration
    {
        int Value { get; }
    }
}
