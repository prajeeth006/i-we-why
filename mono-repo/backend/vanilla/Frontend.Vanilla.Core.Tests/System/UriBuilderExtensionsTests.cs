using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public sealed class UriBuilderExtensionsTests
{
    private UriBuilder builder;

    public UriBuilderExtensionsTests()
        => builder = new UriBuilder("http://bwin.com/");

    private void Verify(UriBuilder result, string expectedUri)
    {
        result.Should().BeSameAs(builder);
        builder.Uri.ToString().Should().Be(expectedUri);
    }

    [Theory]
    [InlineData("http://bwin.com/path", "segment", "http://bwin.com/path/segment")]
    [InlineData("http://bwin.com/path", "/segment/", "http://bwin.com/path/segment/")]
    [InlineData("http://bwin.com/path", "  /", "http://bwin.com/path/  /")]
    [InlineData("http://bwin.com/", "a/b/c", "http://bwin.com/a/b/c")]
    [InlineData("http://bwin.com/path?q=1#section", "segment", "http://bwin.com/path/segment?q=1#section")]
    public void AppendPathSegment_Test(string inputUrl, string segment, string expectedUri)
    {
        builder = new UriBuilder(inputUrl);

        var result = builder.AppendPathSegment(segment); // Act

        Verify(result, expectedUri);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("  ")]
    public void AppendPathSegment_ShouldThrowIfInvalidSegment(string segment)
        => new Action(() => builder.AppendPathSegment(segment))
            .Should().Throw<ArgumentException>();

    [Theory]
    [InlineData("http://bwin.com/", "http://bwin.com/")]
    [InlineData("http://bwin.com/path", "http://bwin.com/path/")]
    [InlineData("http://bwin.com/path/", "http://bwin.com/path/")]
    public void AppendTrailingSlash_Test(string input, string expectedUri)
    {
        builder = new UriBuilder(input);

        var result = builder.AppendTrailingSlash(); // Act

        Verify(result, expectedUri);
    }

    [Theory]
    [InlineData(null, "http://bwin.com/path?q=1&q=2&p=3&e=#section")]
    [InlineData(QueryStringDuplicateHandling.Merge, "http://bwin.com/path?q=1&q=2&p=3&e=#section")]
    [InlineData(QueryStringDuplicateHandling.PreferNew, "http://bwin.com/path?q=2&p=3&e=#section")]
    [InlineData(QueryStringDuplicateHandling.PreferOriginal, "http://bwin.com/path?q=1&p=3&e=#section")]
    public void AddQueryParameters_Test(QueryStringDuplicateHandling? duplicateHandling, string expectedUrl)
    {
        builder = new UriBuilder("http://bwin.com/path?q=1#section");
        var queryParams = new[]
        {
            ("q", "2"),
            ("p", "3"),
            ("e", null), // Empty should also added
        };

        // Act
        var result = duplicateHandling != null
            ? builder.AddQueryParameters(queryParams, duplicateHandling.Value)
            : builder.AddQueryParameters(queryParams);

        Verify(result, expectedUrl);
    }

    [Obsolete("Use other overloads.")]
    [Fact]
    public void AddQueryParametersValueNameValueCollection_Test()
    {
        builder = new UriBuilder("http://bwin.com/path?q=1#section");
        var queryParams = new NameValueCollection
        {
            ["q"] = "2",
            ["p"] = "3",
        };
        queryParams.Add("p", "4");

        var result = builder.AddQueryParameters(queryParams); // Act

        Verify(result, expectedUri: "http://bwin.com/path?q=1&q=2&p=3&p=4#section");
    }

    [Obsolete("Use other overloads.")]
    [Theory]
    [InlineData(QueryStringDuplicateHandling.Merge, "http://bwin.com/path?q=1&q=2&q=4&p=3")]
    [InlineData(QueryStringDuplicateHandling.PreferOriginal, "http://bwin.com/path?q=1&q=2&p=3")]
    [InlineData(QueryStringDuplicateHandling.PreferNew, "http://bwin.com/path?q=4&p=3")]
    public void QueryStringMergingTest(QueryStringDuplicateHandling duplicateHandling, string expectedUrl)
    {
        builder = new UriBuilder("http://bwin.com/path?q=1&q=2");
        var queryParams = new NameValueCollection
        {
            ["q"] = "4",
            ["p"] = "3",
        };

        var result = builder.AddQueryParameters(queryParams, duplicateHandling); // Act

        Verify(result, expectedUrl);
    }

    [Theory, ValuesData(null, "", "   ")]
    public void AddQueryParametersValueTuples_ShouldThrow_IfEmptyKey(string key)
    {
        builder = new UriBuilder("http://bwin.com/path?q=1#section");
        var queryParams = new[] { (key, "foo") };

        Action act = () => builder.AddQueryParameters(queryParams);

        act.Should().Throw<ArgumentException>().WithMessage("Name of a query parameter can't be null nor whitespace. (Parameter 'queryParameters')");
    }

    [Theory]
    [InlineData(null, "http://bwin.com/path?a=1&a=2&p=3#section")]
    [InlineData(QueryStringDuplicateHandling.Merge, "http://bwin.com/path?a=1&a=2&p=3#section")]
    [InlineData(QueryStringDuplicateHandling.PreferNew, "http://bwin.com/path?a=2&p=3#section")]
    [InlineData(QueryStringDuplicateHandling.PreferOriginal, "http://bwin.com/path?a=1&p=3#section")]
    public void AddQueryParametersIfValueNotWhiteSpace_Test(QueryStringDuplicateHandling? duplicateHandling, string expectedUrl)
    {
        builder = new UriBuilder("http://bwin.com/path?a=1#section");
        var queryParams = new[]
        {
            ("p", "3"),
            ("q", "  "),
            ("r", null),
            ("a", "2"),
        };

        // Act
        var result = duplicateHandling != null
            ? builder.AddQueryParametersIfValueNotWhiteSpace(queryParams, duplicateHandling.Value)
            : builder.AddQueryParametersIfValueNotWhiteSpace(queryParams);

        Verify(result, expectedUrl);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void RemoveQueryParameters_Test(bool enumerableOverload)
    {
        builder = new UriBuilder("http://bwin.com/root/path?a=1&b=2&c=3&a=2&b=3&d=4#section");
        var toRemove = new[] { "b", "c", "x" };

        // Act
        var result = enumerableOverload
            ? builder.RemoveQueryParameters((IEnumerable<string>)toRemove)
            : builder.RemoveQueryParameters(toRemove);

        result.Should().BeSameAs(builder);
        result.Uri.ToString().Should().Be("http://bwin.com/root/path?a=1&a=2&d=4#section");
    }

    [Theory]
    [InlineData("test", "http://bwin.com/root/test")]
    [InlineData("test/appended?b=2#other", "http://bwin.com/root/test/appended?b=2#other")]
    public void CombineWith_Test(string uriToAppend, string expectedUri)
    {
        builder = new UriBuilder("http://bwin.com/root/path?a=1#section");

        var result = builder.CombineWith(new PathRelativeUri(uriToAppend)); // Act

        result.Should().BeSameAs(builder);
        result.Uri.ToString().Should().Be(expectedUri);
    }

    [Theory]
    [InlineData(true, "http://bwin.com/path")]
    [InlineData(false, "http://bwin.com/")]
    public void If_ShouldConfigureIfConditionSatisfied(bool condition, string expectedUri)
    {
        var result = builder.If(condition, b => b.AppendPathSegment("path")); // Act

        Verify(result, expectedUri);
    }

    [Theory]
    [InlineData("http://bwin.com/en/pages/football", "en/pages/football")]
    [InlineData("http://bwin.com/page/", "page/")]
    public void GetRelativeUri_Test(string input, string expectedUri)
    {
        var result = new UriBuilder(input).GetRelativeUri(); // Act
        result.Should().Be(new Uri(expectedUri, UriKind.Relative)); // Act
    }

    public static readonly IEnumerable<object[]> GetRelativeUriFailedTestCases = new[]
    {
        new object[] { new UriBuilder(), PathRelativeUri.InvalidValueMessage },
        new object[] { new UriBuilder("file://c:/file.txt"), "Given builder must have valid Host." },
        new object[] { new UriBuilder("urn:sha1:YNCKHTQCWBTRNJIV4WNAE52SJUQCZO5C"), "Given builder must have valid Host." },
        new object[] { new UriBuilder { Scheme = null }, "Given builder must have valid Scheme." },
    };

    [Theory]
    [MemberData(nameof(GetRelativeUriFailedTestCases))]
    public void GetRelativeUri_ShouldThrow_IfInvalidHost(UriBuilder uriBuilder, string expectedErrorSubstr)
    {
        var dummy = uriBuilder;
        new Func<object>(uriBuilder.GetRelativeUri)
            .Should().Throw<ArgumentException>().Which.Message.Should().Contain(expectedErrorSubstr);
    }

    [Fact]
    public void ChangeSchemeWithPort_Test()
    {
        // Act
        var result = builder.ChangeSchemeWithPort("wtf", 66);

        result.Should().BeSameAs(builder);
        result.Uri.Should().Be(new Uri("wtf://bwin.com:66/"));
    }
}
