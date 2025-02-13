using System;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Vanilla.Features.SuspiciousRequest;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.SuspiciousRequest;

public class SuspiciousRequestConfigurationTests
{
    private string regex;
    private string description;

    public SuspiciousRequestConfigurationTests()
    {
        regex = "^.*bwin.*$";
        description = "match";
    }

    private Func<StringRule> RunTest
        => () => new StringRule(regex, description);

    [Fact]
    public void ShouldCreateRuleCorrectly()
    {
        var target = RunTest();

        target.Regex.ToString().Should().Be(regex);
        target.Regex.Options.Should().Be(RegexOptions.Compiled | RegexOptions.IgnoreCase);
        target.Description.Should().Be(description);
    }

    [Fact]
    public void Regex_ShouldThrow_IfNull()
    {
        regex = null;
        RunTest.Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll("Missing " + nameof(StringRule.Regex), description);
    }

    [Fact]
    public void Regex_ShouldThrow_IfInvalid()
    {
        regex = "/**";
        RunTest.Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll(nameof(StringRule.Regex), regex, "isn't a valid regular expression");
    }
}
