using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.Assets.Renderers;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets.Renderers;

public class PreBootstrapAssetRendererTests
{
    private PreBootstrapAssetRenderer renderer;

    public PreBootstrapAssetRendererTests()
    {
        renderer = new PreBootstrapAssetRenderer(new AssetTagRenderer());
    }

    [Fact]
    public void ShouldHaveCorrectType()
    {
        renderer.AssetType.Should().Be(typeof(PreBootstrapAsset));
    }

    [Fact]
    public void ShouldReturnResultFromRenderer()
    {
        renderer.Render(new PreBootstrapAsset("p") { As = "as", Media = "media", Onload = "onload", Relation = PreRelation.Prefetch, Type = "type" },
            BootstrapAssetSection.Head).Should().Be(@"<link rel=""prefetch"" type=""type"" as=""as"" media=""media"" onload=""onload"" href=""p""></link>");
        renderer.Render(new PreBootstrapAsset(null!) { As = "as", Media = "media", Onload = "onload", Relation = PreRelation.Prefetch, Type = "type" },
            BootstrapAssetSection.Head).Should().BeEmpty();
        renderer.Render(new PreBootstrapAsset("p"), BootstrapAssetSection.Body).Should().BeEmpty();
    }
}
