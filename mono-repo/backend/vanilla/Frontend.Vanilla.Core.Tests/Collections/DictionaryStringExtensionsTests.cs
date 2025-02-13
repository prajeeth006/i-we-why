using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public class DictionaryStringExtensionsTests
{
    private Dictionary<string, object> dictionary;

    public DictionaryStringExtensionsTests()
        => dictionary = new Dictionary<string, object> { { "existing1", "whatever" }, { "existing2", 123 } };

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { false, null },
        new object[] { true, null },
        new object[] { true, "" },
        new object[] { true, "abc" },
    };

    [Theory]
    [MemberData(nameof(TestCases))]
    public void TryGetString_ShouldReturnValue_IfExists(bool exists, string value)
    {
        if (exists) dictionary["lol"] = value;

        // Act
        var isFound = dictionary.TryGetString("lol", "gold code", out var result);

        isFound.Should().Be(exists);
        result.Should().Be(value);
    }

    [Fact]
    public void TryGetString_ShouldThrow_IfNotString()
        => RunInvalidTypeTest((k, d) => dictionary.TryGetString(k, d, out _));

    [Theory]
    [MemberData(nameof(TestCases))]
    public void GetString_ShouldReturnValue_IfExists(bool exists, string value)
    {
        if (exists) dictionary["lol"] = value;

        // Act
        dictionary.GetString("lol", "gold code").Should().Be(value);
    }

    [Fact]
    public void GetString_ShouldThrow_IfNotString()
        => RunInvalidTypeTest((k, d) => dictionary.GetString(k, d));

    [Fact]
    public void GetRequiredString_ShouldGetString()
    {
        dictionary["msg"] = "wtf";

        // Act
        dictionary.GetRequiredString("msg", "gold code").Should().Be("wtf");
    }

    [Theory]
    [InlineData(false, null)]
    [InlineData(true, null)]
    [InlineData(true, "")]
    [InlineData(true, "  ")]
    public void GetRequiredString_ShouldThrow_IfNotFoundOrWhiteSpaceValue(bool exists, string value)
    {
        if (exists) dictionary["lol"] = value;

        dictionary.Invoking(d => d.GetRequiredString("lol", "gold code"))
            .Should().Throw<KeyNotFoundException>()
            .Which.Message.Should().ContainAll("gold code", "'lol'", "'existing1'", "'existing2'");
    }

    [Fact]
    public void GetRequiredString_ShouldThrow_IfNotString()
        => RunInvalidTypeTest((k, d) => dictionary.GetRequiredString(k, d));

    private void RunInvalidTypeTest(Func<string, string, object> act)
    {
        dictionary["lol"] = 123;

        act.Invoking(a => a("lol", "gold code"))
            .Should().Throw<InvalidCastException>()
            .Which.Message.Should().ContainAll("gold code", "'lol'", "123", "System.Int32");
    }
}
