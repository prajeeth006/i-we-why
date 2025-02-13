#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Utils;

public class MessageUtilTests
{
    public static readonly IEnumerable<object?[]> FormatObjectTestCases = new[]
    {
        new object?[] { null, "null" },
        new object[] { "", "''" },
        new object[] { "  ", "'  '" },
        new object[] { "hello", "'hello'" },
        new object[] { 'x', "'x'" },
        new object[] { new StringValues((string?)null), "null" },
        new object[] { new StringValues(""), "''" },
        new object[] { new StringValues("hello"), "'hello'" },
        new object[] { new StringValues(new[] { "hello", null, "", "world" }), "['hello', null, '', 'world']" },
        new object[] { new RequiredString("hello"), "'hello'" },
        new object[] { new Uri("http://bwin.com/"), "'http://bwin.com/'" },
        new object[] { new DateTime(2001, 2, 3, 4, 5, 6, DateTimeKind.Local), "2001-02-03 04:05:06 Local" },
        new object[] { new DateTime(2001, 2, 3, 4, 5, 6, DateTimeKind.Utc), "2001-02-03 04:05:06 Utc" },
        new object[] { new UtcDateTime(2001, 2, 3, 4, 5, 6), "2001-02-03 04:05:06 Utc" },
        new object[] { 123, "123" },
        new object[] { new[] { "Chuck", "Norris" }, "'Chuck', 'Norris'" },
        new object[] { new RequiredString[0], "(empty)" },
    };

    [Theory]
    [MemberData(nameof(FormatObjectTestCases))]
    public void FormatObject_Test(object? value, string expected)
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("zh-CN"));
        value.Dump().Should().Be(expected);
    }

    [Theory]
    [InlineData("abc", "System.String")]
    [InlineData(123, "System.Int32")]
    [InlineData(null, "null")]
    public void DumpType_Test(object? value, string expected)
        => value.DumpType().Should().Be(expected);

    [Theory]
    [InlineData(null, null)]
    [InlineData("", "")]
    [InlineData("abc", "abc")]
    [InlineData("1234567890", "12345... (10 chars total)")]
    public void Truncate_Test(string? input, string? expected)
        => MessageUtil.Truncate(input, 5).Should().Be(expected);
}
