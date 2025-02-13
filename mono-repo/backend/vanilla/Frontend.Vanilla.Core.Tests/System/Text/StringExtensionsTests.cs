using System;
using System.Collections.Generic;
using System.Text;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public class StringExtensionsTests
{
    [Theory]
    [InlineData("", "", "a")]
    [InlineData("abc", "abc", null)]
    [InlineData("abc", "abc", "")]
    [InlineData("bc", "abc", "a")]
    [InlineData("abc", "abc", "x")]
    public void RemovePrefixTest(string expected, string input, string prefix)
        => input.RemovePrefix(prefix).Should().Be(expected);

    [Theory]
    [InlineData("", "", "a")]
    [InlineData("abc", "abc", null)]
    [InlineData("abc", "abc", "")]
    [InlineData("ab", "abc", "c")]
    [InlineData("abc", "abc", "x")]
    public void RemoveSuffixTest(string expected, string input, string suffix)
        => input.RemoveSuffix(suffix).Should().Be(expected);

    [Theory]
    [InlineData("", "", "whatever")]
    [InlineData("BWIN", "BWIN", null)]
    [InlineData("BWIN", "BWIN", "")]
    [InlineData("BWIN", "BWIN", "wtf")]
    [InlineData("BWIN", "Hello BWIN", "Hello ")]
    [InlineData("bcccdd", "aabacccadd", "a")]
    public void RemoveAllTest(string expected, string input, string substring)
        => input.RemoveAll(substring).Should().Be(expected);

    [Fact]
    public void RemoveAll_ShouldApplyGivenComparison()
        => "Hello BWIN".RemoveAll("hELlO ", StringComparison.OrdinalIgnoreCase).Should().Be("BWIN");

    [Theory]
    [InlineData("", "")]
    [InlineData("  ", "  ")]
    [InlineData("a", "a")]
    [InlineData("abc", "abc")]
    [InlineData("a", "A")]
    [InlineData("hello", "Hello")]
    [InlineData("helloWorld", "HelloWorld")]
    [InlineData("helloWorld", "HELLOWorld")]
    public void ToCamelCase_Test(string expected, string input)
        => input.ToCamelCase().Should().Be(expected);

    [Theory]
    [InlineData(null, null)]
    [InlineData(null, "")]
    [InlineData(null, "  ")]
    [InlineData("BWIN", "BWIN")]
    public void WhiteSpaceToNull_Test(string expected, string input)
        => input.WhiteSpaceToNull().Should().Be(expected);

    public static readonly IEnumerable<object[]> EncodeTestData = new[]
    {
        new object[] { "", null, new byte[0] },
        new object[] { "Hello", null, new byte[] { 0x48, 0x65, 0x6c, 0x6c, 0x6f } },
        new object[] { "ščťžýáí", null, new byte[] { 0xc5, 0xa1, 0xc4, 0x8d, 0xc5, 0xa5, 0xc5, 0xbe, 0xc3, 0xbd, 0xc3, 0xa1, 0xc3, 0xad } },
    };

    public static readonly IEnumerable<object[]> DecodeTestData =
        EncodeTestData.Append(new[] { new object[] { "Hello", null, new byte[] { 0xef, 0xbb, 0xbf, 0x48, 0x65, 0x6c, 0x6c, 0x6f } } }); // Includes BOM

    [Theory]
    [MemberData(nameof(EncodeTestData))]
    public void EncodeToBytes_Test(string input, Encoding encoding, byte[] expected)
        => input.EncodeToBytes(encoding).Should().Equal(expected);

    [Theory]
    [MemberData(nameof(DecodeTestData))]
    public void DecodeToString_Test(string expected, Encoding encoding, byte[] input)
        => input.DecodeToString(encoding).Should().Be(expected);

    [Theory]
    [InlineData("bwin", StringComparison.OrdinalIgnoreCase, true)]
    [InlineData("Hello", StringComparison.Ordinal, true)]
    [InlineData("bwin", StringComparison.Ordinal, false)]
    [InlineData("wtf", StringComparison.OrdinalIgnoreCase, false)]
    public void Contains_Test(string substr, StringComparison comparison, bool expected)
        => "Hello BWIN".Contains(substr, comparison).Should().Be(expected);

    public static readonly IEnumerable<object[]> ComparisonConversionTestCases = new[]
    {
        new object[] { StringComparison.CurrentCulture, StringComparer.CurrentCulture },
        new object[] { StringComparison.CurrentCultureIgnoreCase, StringComparer.CurrentCultureIgnoreCase },
        new object[] { StringComparison.InvariantCulture, StringComparer.InvariantCulture },
        new object[] { StringComparison.InvariantCultureIgnoreCase, StringComparer.InvariantCultureIgnoreCase },
        new object[] { StringComparison.Ordinal, StringComparer.Ordinal },
        new object[] { StringComparison.OrdinalIgnoreCase, StringComparer.OrdinalIgnoreCase },
    };

    [Theory]
    [MemberData(nameof(ComparisonConversionTestCases))]
    public void ToComparer_ShouldConvertComparisonCorrectly(StringComparison inputComparison, StringComparer expectedComparer)
        => inputComparison.ToComparer().Should().Be(expectedComparer);

    [Theory]
    [InlineData("abcdedg1234", "bcdedg")]
    [InlineData("a", "")]
    public void SubstringWhile_Test(string input, string expected)
    {
        var str = input.SubstringWhile(1, char.IsLetter);
        str.Should().Be(expected);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(4)]
    public void SubstringWhile_ShouldThrowOfOutOfRange(int startIndex)
        => new Action(() => "abc".SubstringWhile(startIndex, char.IsLetter))
            .Should().Throw<ArgumentOutOfRangeException>().WithMessage(
                $"StartIndex must be within given string 'abc' hence between 0 and 3 (both inclusive) but it is {startIndex}. (Parameter 'startIndex')");

    [Theory]
    [InlineData("aabbbccc", "bbb")]
    [InlineData("aabbb", "bbb")]
    [InlineData("aab", "b")]
    [InlineData("aa", "")]
    public void SubstringMax_Test(string input, string expected)
        => input.SubstringMax(2, 3).Should().Be(expected);

    [Theory]
    [InlineData("abc", 'c')]
    [InlineData("a", 'a')]
    [InlineData("  ", ' ')]
    public void LastChar_ShouldReturnLastChar(string input, char expected)
        => input.LastChar().Should().Be(expected);

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void LastChar_ShouldThrow_IfNullOrEmpty(string input)
        => new Action(() => input.LastChar()).Should().Throw();

    public static readonly IEnumerable<object[]> NonEmptyArrayTestCases = new[]
    {
        new object[] { default(StringValues), new string[] { null } },
        new object[] { new StringValues("a"), new[] { "a" } },
        new object[] { new StringValues(new[] { "a", "b" }), new[] { "a", "b" } },
    };

    [Theory]
    [MemberData(nameof(NonEmptyArrayTestCases))]
    public void ToNonEmptyArray_Test(StringValues input, string[] expected)
        => input.ToNonEmptyArray().Should().Equal(expected);

    [Fact]
    public void EnumerateKeyValues_Test()
    {
        var dict = new Dictionary<string, StringValues>
        {
            { "Test-1", "Value 1" },
            { "Test-2", new[] { "Value 2.1", null, "", "Value 2.2" } },
            { "Test-3", default },
        };

        var result = dict.EnumerateKeyValues(); // Act

        result.Should().Equal(
            ("Test-1", "Value 1"),
            ("Test-2", "Value 2.1"),
            ("Test-2", null),
            ("Test-2", ""),
            ("Test-2", "Value 2.2"),
            ("Test-3", null));
    }
}
