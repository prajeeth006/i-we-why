using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Uris;

public class QueryUtilTests
{
    public static readonly IEnumerable<object[]> ParseQueryTestCases = new[]
    {
        GetTestCase(null, new (string, StringValues)[0]),
        GetTestCase("", new (string, StringValues)[0]),
        GetTestCase("?q=1&p=2&q=3", ("q", new[] { "1", "3" }), ("p", "2")),
        GetTestCase("?q=Hello%20democracy&p=Bye+communism", ("q", "Hello democracy"), ("p", "Bye communism")),
    };

    [Theory]
    [MemberData(nameof(ParseQueryTestCases))]
    public void Parse_Test(string inputQuery, Dictionary<string, StringValues> expectedParsedQuery)
        => QueryUtil.Parse(inputQuery).Should().BeEquivalentTo(expectedParsedQuery);

    public static readonly IEnumerable<object[]> BuildTestCases = new[]
    {
        GetTestCase("", new (string, StringValues)[0]),
        GetTestCase("q=1&q=2&p=3", ("q", new[] { "1", "2" }), ("p", "3")),
        GetTestCase("q=", ("q", (string)null)),
        GetTestCase("q=OK%20Google", ("q", "OK Google")),
    };

    private static object[] GetTestCase(string str, params (string, StringValues)[] pairs)
        => new object[] { str, pairs.ToDictionary() };

    [Theory]
    [MemberData(nameof(BuildTestCases))]
    public void Build_Test(string expectedQuery, Dictionary<string, StringValues> inputQuery)
        => QueryUtil.Build(inputQuery).Should().Be(expectedQuery);

    [Theory]
    [InlineData("r", new[] { "66" })]
    [InlineData("q", new[] { "1", "66" })]
    [InlineData("p", new[] { "2", "3", "66" })]
    public void Append_Test(string name, string[] expectedValues)
    {
        var query = new Dictionary<string, StringValues>
        {
            { "q", "1" },
            { "p", new[] { "2", "3" } },
        };

        query.Append(name, "66"); // Act

        query[name].Should().BeEquivalentTo(expectedValues);
    }
}
