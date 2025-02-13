using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class ConfigurationInfoTests
{
    private const string FeatureName = "VanillaFramework.Foo.Bar";
    private Type serviceType;
    private Type implType;
    private Func<object, WithWarnings<object>> factoryFunc;

    public ConfigurationInfoTests()
    {
        serviceType = typeof(IFooConfiguration);
        implType = typeof(FooConfiguration);
        factoryFunc = d => d.WithWarnings();
    }

    private IConfigurationInfo GetTarget() => new ConfigurationInfo(FeatureName, serviceType, implType, typeof(FooFactory), factoryFunc);

    public interface IFooConfiguration { }

    public class FooFactory { }

    public class FooConfiguration
    {
        public int Value { get; set; }
    }

    [Fact]
    public void Constructor_ShouldBeAbleToCreateConfigurationInfo()
    {
        // Act
        var target = GetTarget();

        target.FeatureName.Should().Be(FeatureName);
        target.ServiceType.Should().Be(typeof(IFooConfiguration));
        target.ImplementationType.Should().Be(typeof(FooConfiguration));
        target.ImplementationParameters?.Select(p => p.Name).Should().Equal(nameof(FooConfiguration.Value));
        target.FactoryType.Should().Be(typeof(FooFactory));
    }

    [Fact]
    public void Constructor_ShouldThrow_IfServiceTypeIsNotInterface()
    {
        serviceType = typeof(FooConfiguration);
        RunFailedCtorTest(nameof(IConfigurationInfo.ServiceType), expectedMsg: "interface");
    }

    [Fact]
    public void Constructor_ShouldThrowIfImplementationTypeIsNotClass()
    {
        implType = typeof(IFooConfiguration);
        RunFailedCtorTest(nameof(IConfigurationInfo.ImplementationType), expectedMsg: "non-abstract class");
    }

    public interface IWithSetters
    {
        string FirstName { get; set; }
    }

    [Fact]
    public void Constructor_ShouldThrow_IfPropertySetters()
    {
        serviceType = typeof(IWithSetters);
        RunFailedCtorTest(nameof(IConfigurationInfo.ServiceType), expectedMsg: new object[] { FeatureName, typeof(IWithSetters), nameof(IWithSetters.FirstName) });
    }

    private void RunFailedCtorTest(string expectedParamName, params object[] expectedMsg)
    {
        Action act = () => GetTarget();

        act.Should().Throw<ArgumentException>()
            .Where(ex => ex.ParamName == expectedParamName.ToCamelCase())
            .And.Message.Should().ContainAll(expectedMsg);
    }

    [Fact]
    public void CreateUsingFactory_ShouldExecuteFactoryMethod()
    {
        var input = new object();
        var output = new object().WithWarnings("Wtf");
        factoryFunc = Mock.Of<Func<object, WithWarnings<object>>>(f => f(input) == output);

        // Act
        var result = GetTarget().CreateUsingFactory(input);

        result.Should().BeSameAs(output);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void CreateUsingFactory_ShouldThrow_IfFactoryReturnsNull(bool nullConfig)
    {
        var config = nullConfig ? ((object)null).WithWarnings() : null;
        factoryFunc = _ => config;
        var target = GetTarget();

        Action act = () => target.CreateUsingFactory(new object());

        act.Should().Throw().WithMessage(
            $"Null returned by factory {typeof(FooFactory)} when creating ({typeof(IFooConfiguration)}; DynaCon: {FeatureName}).");
    }

    [Fact]
    public void ToString_ShouldOutputInfo()
        => GetTarget().ToString().Should().Be($"({typeof(IFooConfiguration)}; DynaCon: {FeatureName})");

    [Fact]
    public void ImplementationParameters_ShouldBeNull_IfTypeWithWildcardProperties()
    {
        implType = typeof(Dictionary<string, object>);

        // Act
        GetTarget().ImplementationParameters.Should().BeNull();
    }
}
