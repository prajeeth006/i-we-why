using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public sealed class TrimmedRequiredStringTests
{
    [Theory]
    [InlineData("Hello BWIN")]
    public void ShouldCreateCorrectly(string input)
    {
        // Act
        TrimmedRequiredString target = input;

        target.Value.Should().Be(input);
        target.ToString().Should().Be(input);
    }

    public static readonly IEnumerable<object[]> InvalidTestCases
        = RequiredStringTests.InvalidTestCases.Append(
            new object[] { " not-trimmed-start", "it starts with a white-space." },
            new object[] { "not-trimmed-end ", "it ends with a white-space." });

    [Theory]
    [MemberData(nameof(InvalidTestCases))]
    public void ShouldThrow_IfNotValid(string input, string expectedMsgSuffix)
        => new Func<object>(() => (TrimmedRequiredString)input)
            .Should().Throw<ArgumentException>()
            .WithMessage("The value must be a trimmed required string but " + expectedMsgSuffix);

    [Fact]
    public void ShouldSerializeCorrectly()
    {
        var json = JsonConvert.SerializeObject((TrimmedRequiredString)"bwin");
        json.Should().BeJson("'bwin'");
    }

    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        var str = JsonConvert.DeserializeObject<TrimmedRequiredString>("'bwin'");
        str.ToString().Should().Be("bwin");
    }
}
