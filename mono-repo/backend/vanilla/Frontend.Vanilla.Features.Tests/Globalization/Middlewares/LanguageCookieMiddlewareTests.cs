using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Middlewares;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Middlewares;

public class LanguageCookieMiddlewareTests
{
    private BeforeNextMiddleware target;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ICookieHandler> cookieHandler;
    private Mock<ILanguageService> languageService;
    private HttpContext httpContext;

    public LanguageCookieMiddlewareTests()
    {
        endpointMetadata = new Mock<IEndpointMetadata>();
        cookieHandler = new Mock<ICookieHandler>();
        languageService = new Mock<ILanguageService>();
        httpContext = new DefaultHttpContext();
        target = new LanguageCookieMiddleware(null, endpointMetadata.Object, cookieHandler.Object, languageService.Object);

        languageService.SetupGet(r => r.Current).Returns(TestLanguageInfo.Get(routeValue: "lang"));
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
    }

    private void Act() => target.BeforeNext(httpContext);

    [Fact]
    public void ShouldCallNext_IfNotServingHtmlDocument()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        Act();

        cookieHandler.VerifyNoOtherCalls();
    }

    [Fact]
    public void ShouldSetLanguageCookie()
    {
        Act();

        cookieHandler.Verify(c => c.Set(CookieConstants.Lang, "lang", null));
    }

    [Fact]
    public void ShouldNotSetCookie_IfItAlreadyExistsWithTheSameLanguage()
    {
        cookieHandler.Setup(c => c.GetValue(CookieConstants.Lang)).Returns("lang");

        Act();

        cookieHandler.VerifyWithAnyArgs(c => c.Set(null, null, null), Times.Never);
    }

    [Fact]
    public void ShouldSetLanguageCookie_IfItAlreadyExistsWithDifferentLang()
    {
        cookieHandler.Setup(c => c.GetValue(CookieConstants.Lang)).Returns("old_lang");

        Act();

        cookieHandler.Verify(c => c.Set(CookieConstants.Lang, "lang", null));
    }
}
