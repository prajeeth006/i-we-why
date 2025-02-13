using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class DynaConParameterTests
{
    [Fact]
    public void Constructor_Test()
    {
        var target = new DynaConParameter("service", "Vanilla");

        target.Name.Should().Be("service");
        target.Value.Should().Be("Vanilla");
    }

    [Theory]
    [InlineData(null, "bwin.com", "name")]
    [InlineData("  ", "bwin.com", "name")]
    [InlineData("label", null, "value")]
    [InlineData("label", "  ", "value")]
    public void Constructor_ShouldThrow_IfInvalidValue(string name, string value, string expectedParamName)
        => new Func<object>(() => new DynaConParameter(name, value))
            .Should().Throw<ArgumentException>().Which.ParamName.Should().Be(expectedParamName);

    [Theory]
    [InlineData(".label")]
    [InlineData("context.")]
    public void Constructor_ShouldThrow_IfNameWithLeadingOrTrailingDot(string name)
        => new Func<object>(() => new DynaConParameter(name, "bwin.com"))
            .Should().Throw<ArgumentException>()
            .WithMessage($"{nameof(DynaConParameter.Name)} cannot start nor end with a dot.\r\n"
                         + $"Actual value: '{name}' (Parameter '{nameof(DynaConParameter.Name).ToCamelCase()}')");

    [Theory]
    [InlineData("changesetId")]
    [InlineData("CHANGESETid")]
    // should be case-insensitive
    public void Constructor_ShouldThrow_IfNameEqualsChangesetId(string name)
        => new Func<object>(() => new DynaConParameter(name, "123"))
            .Should().Throw<ArgumentException>()
            .WithMessage(
                $"ChangesetId can't be specified. Use {nameof(DynaConEngineSettingsBuilder)}.{nameof(DynaConEngineSettingsBuilder.ExplicitChangesetId)} instead.\r\n"
                + $"Actual value: '{name}' (Parameter '{nameof(DynaConParameter.Name).ToCamelCase()}')");

    [Theory]
    [InlineData(true, "q", "1", "q", "1")]
    [InlineData(true, "Q", "X", "q", "x")]
    [InlineData(false, "q", "1", "q", "2")]
    [InlineData(false, "q", "1", "p", "1")]
    [InlineData(false, "q", "1", "p", "2")]
    public void Equals_Test(bool expected, string name1, string value1, string name2, string value2)
        => EqualityTest.Run(expected, new DynaConParameter(name1, value1), new DynaConParameter(name2, value2));

    [Fact]
    public void Equals_OtherValues()
        => EqualityTest.RunWithOtherValues(new DynaConParameter("q", "1"));

    [Fact]
    public void ToString_ShouldLogDetails()
        => new DynaConParameter("q", "1").ToString().Should().Be("'q'='1'");
}
