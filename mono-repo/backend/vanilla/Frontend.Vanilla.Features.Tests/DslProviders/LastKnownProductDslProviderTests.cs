using System;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class LastKnownProductDslProviderTests
{
    private ILastKnownProductDslProvider target;
    private Mock<ICookieHandler> cookieHandlerAdapterMock;
    private Mock<IContentService> contentServiceMock;
    private TestLogger<LastKnownProductDslProvider> logMock;

    public LastKnownProductDslProviderTests()
    {
        cookieHandlerAdapterMock = new Mock<ICookieHandler>();
        contentServiceMock = new Mock<IContentService>();
        logMock = new TestLogger<LastKnownProductDslProvider>();
        target = new LastKnownProductDslProvider(cookieHandlerAdapterMock.Object, () => contentServiceMock.Object, logMock);

        var link = new Mock<ILinkTemplate>();
        link.SetupGet(o => o.Url).Returns(new Uri("http://www.bwin.com/"));
        contentServiceMock.Setup(o => o.GetRequired<ILinkTemplate>("MobileLogin-v1.0/Links/BackToProduct", new ContentLoadOptions { RequireTranslation = true }))
            .Returns(link.Object);
    }

    [Fact]
    public void ShouldReturnDefaultValueWhenNoCookie()
    {
        cookieHandlerAdapterMock.Setup(o => o.GetValue(LastKnownProductDslProvider.LastKnownProductCookieName)).Returns(string.Empty);

        target.Name.Should().Be(LastKnownProductDslProvider.ProductUnknown);
        target.PlatformProductId.Should().BeEmpty();
        target.Previous.Should().Be(LastKnownProductDslProvider.ProductUnknown);
        target.Url.Should().Be("http://www.bwin.com/");
    }

    [Fact]
    public void ShouldReturnProductFromCookie()
    {
        cookieHandlerAdapterMock.Setup(o => o.GetValue(LastKnownProductDslProvider.LastKnownProductCookieName))
            .Returns("{\"url\":\"https://sports.m.bwin.com/en\", \"platformProductId\":\"sportsId\", \"previous\":\"casino\",\"name\":\"sports\"}");

        target.Name.Should().Be("sports");
        target.PlatformProductId.Should().Be("sportsId");
        target.Previous.Should().Be("casino");
        target.Url.Should().Be("https://sports.m.bwin.com/en");
    }

    [Fact]
    public void ShouldReturnDefaultValueWhenCookieIsCorruptedAndLogError()
    {
        cookieHandlerAdapterMock.Setup(o => o.GetValue(LastKnownProductDslProvider.LastKnownProductCookieName)).Returns("WatchOut");

        target.Name.Should().Be(LastKnownProductDslProvider.ProductUnknown);
        target.PlatformProductId.Should().BeEmpty();
        target.Previous.Should().Be(LastKnownProductDslProvider.ProductUnknown);
        logMock.Logged[0].Verify(LogLevel.Warning, (e) => e.GetType() == typeof(JsonReaderException), ("value", "WatchOut"));
    }
}
