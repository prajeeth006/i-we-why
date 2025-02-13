using FluentAssertions;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;
using Frontend.Vanilla.Features.HtmlInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.DataLayer.TagManagers;

public class GoogleTagManagerTests
{
    private ITagManager target;
    private TrackingConfiguration config;
    private Mock<IHtmlInjectionControlOverride> htmlInjectionControlOverride;

    public GoogleTagManagerTests()
    {
        config = new TrackingConfiguration
        {
            DataLayerName = "dataLayer66",
            IsGoogleTagManagerEnabled = true,
            GoogleTagManagerContainerId = "GTM-ACME1",
        };
        htmlInjectionControlOverride = new Mock<IHtmlInjectionControlOverride>();

        target = new GoogleTagManager(config, htmlInjectionControlOverride.Object);
    }

    [Theory]
    [InlineData(true, false, true)]
    [InlineData(false, false, false)]
    [InlineData(true, true, false)]
    [InlineData(false, true, false)]
    public void IsEnabled_ShouldUseConfig(bool isEnabled, bool isDisabledByOverride, bool expected)
    {
        config.IsGoogleTagManagerEnabled = isEnabled;
        htmlInjectionControlOverride.Setup(h => h.IsDisabled(HtmlInjectionKind.Gtm)).Returns(isDisabledByOverride);
        target.IsEnabled.Should().Be(expected); // Act
    }

    [Fact]
    public void Name_ShouldBeValid()
        => target.Name.Should().NotBeNull();

    [Fact]
    public void Renderer_ShouldRenderTagManagerScript()
    {
        var result = target.RenderBootstrapScript(); // Act

        result.ToString().Should().ContainAll(
            "(window,document,'script','dataLayer66','GTM-ACME1')",
            "<noscript><iframe",
            "src='//www.googletagmanager.com/ns.html?id=GTM-ACME1'");
    }

    [Fact]
    public void Renderer_ShouldRenderTagManagerScript_WhenClientInjectionTrueAndSkipClientInjectionCheckIsTrue()
    {
        config.UseClientInjection = true;

        var result = target.RenderBootstrapScript(true); // Act

        result.ToString().Should().ContainAll(
            "(window,document,'script','dataLayer66','GTM-ACME1')",
            "<noscript><iframe",
            "src='//www.googletagmanager.com/ns.html?id=GTM-ACME1'");
    }

    [Fact]
    public void RenderBootstrapScript_ShouldRenderOnlyNoScriptTag_WhenUseClientInjectionIsTrue()
    {
        config.UseClientInjection = true;

        var result = target.RenderBootstrapScript(); // Act

        result.ToString().Should().NotContainAll("<script>", "</script>");
        result.ToString().Should().ContainAll(
            "<noscript><iframe",
            "src='//www.googletagmanager.com/ns.html?id=GTM-ACME1'");
    }

    [Fact]
    public void GetClientScript_ShouldReturnScriptWithoutTag_WhenUseClientInjectionIsTrue()
    {
        config.UseClientInjection = true;

        var result = target.GetClientScript(); // Act

        result.ToString().Should().NotContainAll("<script>", "</script>");
        result.ToString().Should().ContainAll("(window,document,'script','dataLayer66','GTM-ACME1')");
    }
}
