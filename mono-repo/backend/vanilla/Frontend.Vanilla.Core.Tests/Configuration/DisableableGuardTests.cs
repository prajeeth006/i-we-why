using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class DisableableGuardTests
{
    private IDisableableGuard target;
    private IFooDisableableConfiguration guardedConfig;
    private FooConfiguration underlyingConfig;

    public DisableableGuardTests()
    {
        target = new DisableableGuard();
        underlyingConfig = new FooConfiguration { IsEnabled = true, Value = "test" };
        guardedConfig = (IFooDisableableConfiguration)target.Decorate(typeof(IFooDisableableConfiguration), underlyingConfig);
    }

    private sealed class FooConfiguration : IFooDisableableConfiguration
    {
        public string Value { get; set; }

        public bool IsEnabled { get; set; }

        public int Calculate(int number, string str)
            => number + str.Length;
    }

    [Fact]
    public void ShouldGetValueFromInnerConfig_IfEnabled()
    {
        guardedConfig.IsEnabled.Should().BeTrue();
        guardedConfig.Value.Should().Be("test");
        guardedConfig.Calculate(100, "abc").Should().Be(103);
    }

    [Fact]
    public void ShouldReturnFalse_IfDisabledAndIsEnabledAccessed()
    {
        underlyingConfig.IsEnabled = false;
        guardedConfig.IsEnabled.Should().BeFalse();
    }

    public static readonly IEnumerable<object[]> ThrowTestCases = new[]
    {
        new object[] { new Func<IFooDisableableConfiguration, object>(c => c.Value), "get_Value" },
        new object[] { new Func<IFooDisableableConfiguration, object>(c => c.Calculate(100, "abc")), "Calculate" },
    };

    [Theory]
    [MemberData(nameof(ThrowTestCases))]
    public void ShouldThrow_IfDisabledAndOtherMembersAccessed(Func<IFooDisableableConfiguration, object> func, string reportedMember)
    {
        underlyingConfig.IsEnabled = false;
        guardedConfig.Invoking(func).Should().Throw<InvalidOperationException>().WithMessage(
            $"{typeof(FooConfiguration)} has IsEnabled = false therefore you can't call '{reportedMember}' nor access its other members. Check IsEnabled first and if disabled then don't execute the feature.");
    }

    public interface INotDisableableConfiguration { }

    [Fact]
    public void ShouldThrow_IfNotDisableableConfiguration()
    {
        var config = Mock.Of<INotDisableableConfiguration>();

        Action act = () => target.Decorate(typeof(INotDisableableConfiguration), config);

        act.Should().Throw<ArgumentException>().Which.Message.Should()
            .Contain("assignable").And.Contain(typeof(IDisableableConfiguration).ToString());
    }

    [Fact]
    public void ShouldThrow_IfConfigInterfaceIsNotInterface()
    {
        Action act = () => target.Decorate(typeof(FooConfiguration), underlyingConfig);

        act.Should().Throw<ArgumentException>().Which.Message.Should()
            .Contain("interface").And.Contain(typeof(FooConfiguration).ToString());
    }
}

public interface IFooDisableableConfiguration : IDisableableConfiguration
{
    string Value { get; }
    int Calculate(int number, string str);
}
