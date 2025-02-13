using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Globalization.Middlewares;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Middlewares;

public class VisitorSettingsCultureMiddlewareTests
{
    private BeforeNextMiddleware target;
    private IVisitorSettingsManager visitorSettingsManager;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ICookieHandler> cookieHandler;

    private HttpContext ctx;
    private VisitorSettings oldSettings;

    public VisitorSettingsCultureMiddlewareTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
        visitorSettingsManager = Mock.Of<IVisitorSettingsManager>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        cookieHandler = new Mock<ICookieHandler>();
        target = new VisitorSettingsCultureMiddleware(null, visitorSettingsManager, endpointMetadata.Object, cookieHandler.Object);

        ctx = new DefaultHttpContext();

        visitorSettingsManager.Current = oldSettings = TestVisitorSettings.Get("zh-CN");
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
    }

    private void Act() => target.BeforeNext(ctx);

    [Theory]
    [InlineData(null, false)]
    [InlineData("de-DE", true)]
    public void ShouldUpdateSettings_IfCultureChanged(string oldCulture, bool expectedIsLangChanged)
    {
        visitorSettingsManager.Current = oldSettings = TestVisitorSettings.Get(oldCulture);

        Act();

        visitorSettingsManager.Current.Should().BeEquivalentTo(oldSettings.With("zh-CN"));
        if (expectedIsLangChanged)
            cookieHandler.Verify(o => o.Set("isLanguageChanged", "true", null));
    }

    [Fact]
    public void ShouldNotUpdateSettings_IfCultureNotChanged()
    {
        Act();

        visitorSettingsManager.Current.Should().BeSameAs(oldSettings);
    }

    [Fact]
    public void ShouldNotUpdateSettings_IfNotHtmlDocument()
    {
        visitorSettingsManager.Current = oldSettings = TestVisitorSettings.Get("de-DE");
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        Act();

        visitorSettingsManager.Current.Should().BeSameAs(oldSettings);
    }
}
