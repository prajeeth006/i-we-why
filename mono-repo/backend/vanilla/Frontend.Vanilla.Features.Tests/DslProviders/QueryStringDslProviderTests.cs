using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.WebUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class QueryStringDslProviderTests
{
    private IQueryStringDslProvider target;
    private Mock<IBrowserUrlProvider> browserUrlProvider;

    public QueryStringDslProviderTests()
    {
        browserUrlProvider = new Mock<IBrowserUrlProvider>();
        target = new QueryStringDslProvider(browserUrlProvider.Object);
    }

    [Theory]
    [InlineData("q", "1")]
    [InlineData("e", "")]
    [InlineData("wtf", "")]
    [InlineData("", "")]
    public void Get_ShouldGetParameterValue(string key, string expected)
    {
        browserUrlProvider.SetupGet(p => p.Url).Returns(new HttpUri("http://www.bwin.com/page?q=1&e="));

        // Act & assert
        target.Get(key).Should().Be(expected);
    }

    [Theory]
    [InlineData("http://www.bwin.com/page", "http://www.bwin.com/page?q=3")]
    [InlineData("http://www.bwin.com/page?q=1", "http://www.bwin.com/page?q=3")]
    [InlineData("http://www.bwin.com/page?q=1&p=2", "http://www.bwin.com/page?q=3&p=2")]
    public void Set_ShouldSetParameter(string browserUrl, string expectedUrl)
    {
        browserUrlProvider.SetupGet(p => p.Url).Returns(new HttpUri(browserUrl));

        // Act
        target.Set("q", "3");

        browserUrlProvider.Verify(p => p.EnqueueRedirect(new HttpUri(expectedUrl), false));
    }

    [Theory]
    [InlineData("http://www.bwin.com/page", "http://www.bwin.com/page")]
    [InlineData("http://www.bwin.com/page?q=1", "http://www.bwin.com/page")]
    [InlineData("http://www.bwin.com/page?q=1&p=2", "http://www.bwin.com/page?p=2")]
    public void Remove_ShouldRemoveParameter(string browserUrl, string expectedUrl)
    {
        browserUrlProvider.SetupGet(p => p.Url).Returns(new HttpUri(browserUrl));

        // Act
        target.Remove("q");

        browserUrlProvider.Verify(p => p.EnqueueRedirect(new HttpUri(expectedUrl), false));
    }
}
