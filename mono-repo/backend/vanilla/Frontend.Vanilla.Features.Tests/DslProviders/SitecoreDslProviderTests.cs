using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class SitecoreDslProviderTests
{
    private ISitecoreDslProvider target;
    private Mock<ISitecoreLinkUrlProvider> linkUrlProvider;

    public SitecoreDslProviderTests()
    {
        linkUrlProvider = new Mock<ISitecoreLinkUrlProvider>();
        target = new SitecoreDslProvider(() => linkUrlProvider.Object);
    }

    [Theory, ValuesData("/en/indian", "http://xxx.bwin.com/en/indian")]
    public async Task ShouldGetLinkUrl(string urlString)
    {
        var mode = TestExecutionMode.Get();
        linkUrlProvider.Setup(p => p.GetUrlAsync(mode, "App-v1.0/Links/Home")).ReturnsAsync(new Uri(urlString, UriKind.RelativeOrAbsolute));

        // Act
        var result = await target.GetLinkAsync(mode, "App-v1.0/Links/Home");

        result.Should().Be(urlString);
    }
}
