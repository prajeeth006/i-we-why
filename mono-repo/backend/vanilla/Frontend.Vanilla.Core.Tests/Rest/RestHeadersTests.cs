using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest;

public class RestResponseHeadersTests : RestHeadersTests<RestResponseHeaders> { }

public class RestRequestHeadersTests2 : RestHeadersTests<RestRequestHeaders> { }

public abstract class RestHeadersTests<THeaders>
    where THeaders : RestHeaders
{
    private static RestHeaders GetTarget(IEnumerable<KeyValuePair<string, StringValues>> headers = null)
        => (RestHeaders)Activator.CreateInstance(typeof(THeaders), headers);

    [Fact]
    public void Constructor_ShouldBeEmptyByDefault()
        => GetTarget().Should().BeEmpty(); // Act

    [Fact]
    public void Constructor_ShouldCopyHeaders()
    {
        var original = new Dictionary<string, StringValues> { { "foo", "bar" } };

        var target = GetTarget(original); // Act

        target.Should().Equal(original);
    }

    [Fact]
    public void ShouldBeCaseInsensitive()
    {
        var target = GetTarget(new Dictionary<string, StringValues> { { "Test-X", "Value X" } });
        target.Should().Contain("test-x", "Value X"); // Act
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData("  not-trimmed")]
    [InlineData("with white spaces")]
    public void ShouldThrow_IfInvalidHeaderName(string headerName)
    {
        var target = GetTarget();

        var act = () => target.ValidateKey(headerName); // Act

        act.Should().Throw<ArgumentException>()
            .Which.Message.Should().StartWith("HTTP header name").And.EndWith("(Parameter 'key')");
    }

    [Fact]
    public void AddIfValueNotWhiteSpace_Test()
    {
        var target = GetTarget();

        target.AddIfValueNotWhiteSpace( // Act
            ("ValidHeader1", "Value 1"),
            ("NullHeader", null),
            ("EmptyHeader", ""),
            ("WhiteSpaceHeader", "  "),
            ("ValidHeader2", "Value 2"));

        target.Should().Equal(new Dictionary<string, StringValues>
        {
            { "ValidHeader1", "Value 1" },
            { "ValidHeader2", "Value 2" },
        });
    }

    [Fact]
    public void ToString_ShouldReturnAllNamesAndValues()
    {
        var target = GetTarget(new Dictionary<string, StringValues>
        {
            { "Test-1", "Value 1" },
            { "Test-2", new[] { "Value 2.1", null, "", "Value 2.2" } },
            { "Test-3", (string)null },
        });
        target.ToString().Should().Be("Test-1='Value 1', Test-2=['Value 2.1', null, '', 'Value 2.2'], Test-3=null"); // Act & assert
    }
}

public class RestRequestHeadersTests
{
    public static IEnumerable<object[]> TestCases => RestRequestConverter.CalculatedHeaders.Select(h => new object[] { h });

    [Theory]
    [MemberData(nameof(TestCases))]
    public void RequestHeaders_ShouldThrow_IfAddingCalculatedHeaders(string headerName)
    {
        var target = new RestRequestHeaders();

        var act = () => target.ValidateKey(headerName); // Act

        act.Should().Throw<ArgumentException>()
            .WithMessage("Particular HTTP header can't be specified in RestRequest.Headers"
                         + " because it's automatically calculated according to the RestRequest.Content.\r\n"
                         + $"Actual value: '{headerName}'"
                         + " (Parameter 'key')");
    }
}
