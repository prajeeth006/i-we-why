using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.WebUtilities;
using Moq;
using Xunit;
using Xunit.Sdk;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public class RequestDslRedirectorTests
{
    [Theory]
    [MemberData(nameof(GetRedirectTestCases))]
    public void RedirectTests(
#pragma warning disable xUnit1026 // Theory methods should use all of their parameters
#pragma warning disable SA1114 // Parameter list should follow declaration
        string description,
#pragma warning restore SA1114 // Parameter list should follow declaration
#pragma warning restore xUnit1026 // Theory methods should use all of their parameters
        string url,
        string currentQueryString,
        bool permanentRedirect,
        bool preserveQuery,
        HttpUri expectedUri,
        bool shouldThrowException)
    {
        var callCount = 0;
        bool? permanentRedirectParam = null;
        HttpUri uriParam = null;

        var browserUrlProvider = new Mock<IBrowserUrlProvider>();
        browserUrlProvider.Setup(b => b.Url).Returns(new HttpUri($"http://example.org{currentQueryString}"));
        browserUrlProvider.Setup(b => b.EnqueueRedirect(It.IsAny<HttpUri>(), It.IsAny<bool>())).Callback((HttpUri uri, bool isPerm) =>
        {
            permanentRedirectParam = isPerm;
            uriParam = uri;
            callCount++;
        });

        var redirector = new RequestDslRedirector(browserUrlProvider.Object);

        try
        {
            redirector.Redirect(url, permanentRedirect, preserveQuery);
            shouldThrowException.Should().BeFalse();
            callCount.Should().Be(1);
            permanentRedirectParam.Should().Be(permanentRedirect);
            expectedUri.Should().NotBeNull();
            uriParam.Should().BeEquivalentTo(expectedUri);
        }
        catch (XunitException)
        {
            throw;
        }
#pragma warning disable CS0168 // Variable is declared but never used
        catch (Exception ex)
#pragma warning restore CS0168 // Variable is declared but never used
        {
            shouldThrowException.Should().BeTrue();
        }
    }

    public static IEnumerable<object[]> GetRedirectTestCases()
    {
        object[] GetTestCase(
            string description,
            string url,
            string currentQueryString,
            bool permanentRedirect,
            bool preserveQuery,
            HttpUri expectedUri,
            bool shouldThrowException = false) =>
            new object[] { description, url, currentQueryString, permanentRedirect, preserveQuery, expectedUri, shouldThrowException };

        yield return GetTestCase("null", null, "", true, false, null, true);

        yield return GetTestCase("no query, permanent", "http://example.org", "", true, false, new HttpUri("http://example.org"));
        yield return GetTestCase("no query, temporary", "http://example.org", "", false, false, new HttpUri("http://example.org"));
        yield return GetTestCase("no query, temporary, preserveQuery", "http://example.org", "", false, true, new HttpUri("http://example.org"));

        yield return GetTestCase("query, permanent", "http://example.org?a=b&b=c", "", true, false, new HttpUri("http://example.org?a=b&b=c"));
        yield return GetTestCase("query, temporary", "http://example.org?a=b&b=c", "", false, false, new HttpUri("http://example.org?a=b&b=c"));

        yield return GetTestCase(
            "query, temporary, some current query",
            "http://example.org?a=b&b=c",
            "?c=d&d=e",
            false,
            false,
            new HttpUri("http://example.org?a=b&b=c"));

        yield return GetTestCase(
            "query, temporary, some current query with duplicates",
            "http://example.org?a=b&b=c",
            "?a=x&c=d&d=e",
            false,
            false,
            new HttpUri("http://example.org?a=b&b=c"));

        yield return GetTestCase(
            "query, temporary, preserveQuery",
            "http://example.org?a=b&b=c",
            "",
            false,
            true,
            new HttpUri("http://example.org?a=b&b=c"));

        yield return GetTestCase(
            "query, temporary, preserveQuery, some current query",
            "http://example.org?a=b&b=c",
            "?c=d&d=e",
            false,
            true,
            new HttpUri("http://example.org?a=b&b=c&c=d&d=e"));

        yield return GetTestCase(
            "query, temporary, preserveQuery, some current query with duplicates",
            "http://example.org?a=b&b=c",
            "?a=x&c=d&d=e",
            false,
            true,
            new HttpUri("http://example.org?a=b&b=c&c=d&d=e"));

        yield return GetTestCase("does not url encode",
            "http://example.org?a=some text with spaces and /&b=c",
            "",
            false,
            false,
            new HttpUri("http://example.org?a=some text with spaces and /&b=c"));

        yield return GetTestCase(
            "does not double encode",
            "http://example.org?a=some%20text%20with%20spaces%20and%20%2F&b=c",
            "",
            false,
            false,
            new HttpUri("http://example.org?a=some%20text%20with%20spaces%20and%20%2F&b=c"));

        yield return GetTestCase(
            "url param test",
            "http://example.org?a=https%3A%2F%2Fqa1.promo.bwin.com%2Fen%2Fpromo%2Fep%2Fc%2Fcoinfliptest%3Fpromoid%3D19491%26promotype%3Dflip_a_coin%26_mode%3Dpreview",
            "",
            false,
            false,
            new HttpUri(
                "http://example.org?a=https%3A%2F%2Fqa1.promo.bwin.com%2Fen%2Fpromo%2Fep%2Fc%2Fcoinfliptest%3Fpromoid%3D19491%26promotype%3Dflip_a_coin%26_mode%3Dpreview"));
    }
}
