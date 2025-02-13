using System;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Globalization.Middlewares;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Middlewares;

public class LanguageResolutionMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<ICultureUrlTokenResolver> cultureUrlTokenResolver;
    private Mock<IUserPreferredLanguageResolver> userPreferredLanguageResolver;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;

    private DefaultHttpContext ctx;
    private CultureUrlTokenSource tokenSource;

    public LanguageResolutionMiddlewareTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("en-US"));
        next = new Mock<RequestDelegate>();
        var config = new Mock<IGlobalizationConfiguration>();
        cultureUrlTokenResolver = new Mock<ICultureUrlTokenResolver>();
        userPreferredLanguageResolver = new Mock<IUserPreferredLanguageResolver>();
        var allowedLanguagesResolver = new Mock<IAllowedLanguagesResolver>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        target = new LanguageResolutionMiddleware(
            next.Object,
            config.Object,
            cultureUrlTokenResolver.Object,
            userPreferredLanguageResolver.Object,
            allowedLanguagesResolver.Object,
            endpointMetadata.Object,
            internalRequestEvaluator.Object);

        ctx = new DefaultHttpContext();
        tokenSource = RandomGenerator.Get<CultureUrlTokenSource>();

        allowedLanguagesResolver.SetupGet(r => r.Languages).Returns(new[] { TestLanguageInfo.Get("zh-CN", "covid") });
        userPreferredLanguageResolver.Setup(r => r.Resolve()).Returns(TestLanguageInfo.Get("sw-KE"));
        config.SetupGet(c => c.DefaultLanguage).Returns(TestLanguageInfo.Get(routeValue: "ebola"));
        config.SetupGet(c => c.HiddenLanguages).Returns(new[] { TestLanguageInfo.Get(routeValue: "aids") });
        config.SetupGet(c => c.OfflineLanguages).Returns(new[] { TestLanguageInfo.Get(routeValue: "plague") });
        ctx.Response.Body = new MemoryStream();
    }

    private Func<Task> Act => () => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldResolveCultureFromUrlToken()
    {
        cultureUrlTokenResolver.Setup(r => r.GetToken(ctx)).Returns(("covid", tokenSource));
        await RunNextTest(expectedCulture: "zh-CN");
    }

    [Fact]
    public async Task ShouldResolvePreferredCulture_IfNoToken()
    {
        cultureUrlTokenResolver.Setup(r => r.GetToken(ctx)).Returns(("ignored", null));
        await RunNextTest(expectedCulture: "sw-KE");
    }

    private async Task RunNextTest(string expectedCulture)
    {
        await Act();

        CultureInfo.CurrentCulture.Name.Should().Be(expectedCulture);
        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
    }

    [Theory, ValuesData(null, "", "shit")]
    public async Task ShouldReturnNotFound_IfInvalidTokens(string token)
    {
        cultureUrlTokenResolver.Setup(r => r.GetToken(ctx)).Returns((token, tokenSource));

        await Act();

        ctx.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);
        ctx.Response.VerifyEmptyBody();
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldReturnExplicitMessage_IfInvalidTokens_AndInternalRequest()
    {
        cultureUrlTokenResolver.Setup(r => r.GetToken(ctx)).Returns(("shit", tokenSource));
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);

        await Act();

        ctx.Response.ContentType.Should().Be(ContentTypes.Text);
        ctx.Response.GetBodyString().Should().ContainAll("unsupported", "'culture'", "'shit'", "'covid' (zh-CN)");
    }

    [Theory]
    [InlineData("aids", false, "HiddenLanguages")]
    [InlineData("plague", true, "OfflineLanguages")]
    public async Task ShouldRedirectToDefaultLanguage_IfHtmlDocument_AndHiddenOrOfflineLanguage(string token, bool expectedPermanent, string expectedSource)
    {
        cultureUrlTokenResolver.Setup(r => r.GetToken(ctx)).Returns((token, tokenSource));
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        cultureUrlTokenResolver.Setup(r => r.GetUrlWithCultureToken(ctx, "ebola")).Returns(new HttpUri("http://bwin.com/def/lang?q=1"));

        await Act();

        ctx.Response.VerifyRedirect("/def/lang?q=1", expectedPermanent);
        ctx.Response.Headers[HttpHeaders.XRedirectSource].ToString().Should().Contain(expectedSource);
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldThrow_IfHtmlDocument_ButInvalidLanguge()
    {
        cultureUrlTokenResolver.Setup(r => r.GetToken(ctx)).Returns(("shit", tokenSource));
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);

        (await Act.Should().ThrowAsync<Exception>()).Which.Message.Should().Contain("CultureRouteConstraint");
    }
}
