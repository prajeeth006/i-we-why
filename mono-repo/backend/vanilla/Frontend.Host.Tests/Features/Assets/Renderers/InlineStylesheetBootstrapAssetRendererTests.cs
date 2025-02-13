using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.Assets.Renderers;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets.Renderers;

public class InlineStylesheetBootstrapAssetRendererTests
{
    private readonly InlineStylesheetBootstrapAssetRenderer renderer = new (new AssetTagRenderer());

    [Fact]
    public void ShouldHaveCorrectType()
    {
        renderer.AssetType.Should().Be(typeof(InlineStylesheetBootstrapAsset));
    }

    [Fact]
    public void ShouldReturnResultFromRenderer()
    {
        renderer.Render(new InlineStylesheetBootstrapAsset("c"), BootstrapAssetSection.Head).Should().Be("<style>c</style>");
        renderer.Render(new InlineStylesheetBootstrapAsset("c"), BootstrapAssetSection.Body).Should().BeEmpty();
    }
}
