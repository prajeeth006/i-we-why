using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.Assets.Renderers;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets.Renderers;

public class ScriptBootstrapAssetRendererTests
{
    private ScriptBootstrapAssetRenderer target;

    public ScriptBootstrapAssetRendererTests()
    {
        target = new ScriptBootstrapAssetRenderer(new AssetTagRenderer());
    }

    [Fact]
    public void ShouldHaveCorrectType()
    {
        target.AssetType.Should().Be(typeof(ScriptBootstrapAsset));
    }

    [Fact]
    public void ShouldReturnResultFromRenderer()
    {
        target.Render(new ScriptBootstrapAsset("p"), BootstrapAssetSection.Body).Should().Be(@"<script type=""text/javascript"" src=""p""></script>");
        target.Render(new ScriptBootstrapAsset("p"), BootstrapAssetSection.Head).Should().BeEmpty();
        target.Render(new ScriptBootstrapAsset(null!), BootstrapAssetSection.Body).Should().BeEmpty();
        target.Render(new ScriptBootstrapAsset("p") { IsHeadScript = true }, BootstrapAssetSection.Body).Should().BeEmpty();
        target.Render(new ScriptBootstrapAsset("p") { IsHeadScript = true }, BootstrapAssetSection.Head).Should().Be(@"<script type=""text/javascript"" src=""p""></script>");
        target.Render(new ScriptBootstrapAsset("p") { Module = ScriptBootstrapAssetModule.Module }, BootstrapAssetSection.Body).Should().Be(@"<script type=""module"" src=""p""></script>");
        target.Render(new ScriptBootstrapAsset("p") { Module = ScriptBootstrapAssetModule.NoModule }, BootstrapAssetSection.Body).Should().Be(@"<script nomodule="""" defer="""" type=""text/javascript"" src=""p""></script>");
    }
}
