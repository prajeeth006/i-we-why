using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public sealed class RequiredStringTests
{
    [Theory]
    [InlineData("Hello BWIN", false)]
    [InlineData("Hello BWIN", true)]
    [InlineData("   BWIN  ", false)]
    [InlineData("   BWIN  ", true)]
    [InlineData("!@#$%^&*()_+{}:\"|<>?-=[];'\\,./ABCabc012šßお汉 \t ", false)]
    [InlineData("!@#$%^&*()_+{}:\"|<>?-=[];'\\,./ABCabc012šßお汉 \t ", true)]
    public void Constructor_ShouldCreateCorrectly(
        string input,
        bool useImplicitOperator)
    {
        RequiredString target;

        // Act
        if (useImplicitOperator)
            target = input;
        else
            target = new RequiredString(input);

        target.Value.Should().Be(input);
        target.ToString().Should().Be(input);
    }

    public static readonly IEnumerable<object[]> InvalidTestCases = new[]
    {
        new object[] { null, $"it is null." },
        new object[] { "", $"it is empty." },
        new object[] { "  ", $"it contains only white-spaces." },
    };

    [Theory]
    [MemberData(nameof(InvalidTestCases))]
    public void Constructor_ShouldThrow_IfNotValid(string input, string expectedMsgSuffix)
        => new Func<object>(() => new RequiredString(input))
            .Should().Throw<ArgumentException>()
            .WithMessage("The value must be a required string but " + expectedMsgSuffix);

    [Theory]
    [InlineData(null, null)]
    [InlineData("", null)]
    [InlineData("  ", null)]
    [InlineData("Hello BWIN", "Hello BWIN")]
    [InlineData("  BWIN  ", "  BWIN  ")]
    public void TryCreate_ShouldCreate_IfValid(string input, string expected)
    {
        var target = RequiredString.TryCreate(input); // Act
        (target?.Value).Should().Be(expected);
    }

    [Theory]
    [InlineData("bwin")]
    [InlineData(null)]
    public void CastOperatorString_ShouldCastCorrectly(string value)
    {
        var target = value != null ? new RequiredString(value) : null;

        // Act
        string casted = target;

        casted.Should().Be(value);
    }

    [Theory]
    [InlineData("bwin", new[] { "bwin" })]
    [InlineData(null, new string[0])]
    public void CastOperatorStringValues_ShouldCastCorrectly(string input, string[] expected)
    {
        var target = input != null ? new RequiredString(input) : null;

        // Act
        StringValues casted = target;

        casted.ToArray().Should().Equal(expected);
    }

    [Fact]
    public void ShouldSerializeCorrectly()
    {
        var json = JsonConvert.SerializeObject((RequiredString)"bwin");
        json.Should().BeJson("'bwin'");
    }

    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        var str = JsonConvert.DeserializeObject<RequiredString>("'bwin'");
        str.ToString().Should().Be("bwin");
    }

    [Theory]
    [InlineData("Bwin", true)]
    [InlineData("bwin", false)]
    [InlineData("other", false)]
    [InlineData("  ", false)]
    [InlineData(null, false)]
    public void Equals_Test(string otherRaw, bool expected)
    {
        var target = new RequiredString("Bwin");
        var other = !string.IsNullOrWhiteSpace(otherRaw) ? new RequiredString(otherRaw) : null;

        EqualityTest.Run(expected, target, other); // Tests IEquatable<RequiredString>
        target.Equals(otherRaw).Should().Be(expected); // Tests IEquatable<string>
    }

    [Fact]
    public void Equals_OtherValues_Test()
        => EqualityTest.RunWithOtherValues<RequiredString>("bwin");

    [Theory]
    [InlineData("Bwin", true)]
    [InlineData("bwin", true)]
    [InlineData("other", false)]
    [InlineData("  ", false)]
    [InlineData(null, false)]
    public void EqualsIgnoreCase_TesT(string other, bool expected)
        => new RequiredString("Bwin").EqualsIgnoreCase(other).Should().Be(expected);
}
