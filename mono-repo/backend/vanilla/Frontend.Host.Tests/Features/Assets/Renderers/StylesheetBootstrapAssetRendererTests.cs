using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.Assets.Renderers;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets.Renderers;

public class StylesheetBootstrapAssetRendererTests
{
    private StylesheetBootstrapAssetRenderer renderer;

    public StylesheetBootstrapAssetRendererTests()
    {
        renderer = new StylesheetBootstrapAssetRenderer(new AssetTagRenderer());
    }

    [Fact]
    public void ShouldHaveCorrectType()
    {
        renderer.AssetType.Should().Be(typeof(StylesheetBootstrapAsset));
    }

    [Fact]
    public void ShouldReturnResultFromRenderer()
    {
        renderer.Render(new StylesheetBootstrapAsset("p"), BootstrapAssetSection.Head).Should().Be(@"<link rel=""stylesheet"" type=""text/css"" href=""p""></link>");
        renderer.Render(new StylesheetBootstrapAsset("p") { LazyLoad = AssetLazyLoadStrategy.Preload }, BootstrapAssetSection.Head).Should()
            .Be(@"<link rel=""preload"" onload=""this.onload=null;this.rel='stylesheet'"" as=""style"" type=""text/css"" href=""p""></link>");
        renderer.Render(new StylesheetBootstrapAsset("p"), BootstrapAssetSection.Body).Should().BeEmpty();
        renderer.Render(new StylesheetBootstrapAsset(null!), BootstrapAssetSection.Head).Should().BeEmpty();
    }
}
