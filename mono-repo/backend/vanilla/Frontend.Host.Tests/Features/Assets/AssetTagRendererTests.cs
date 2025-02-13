using FluentAssertions;
using Frontend.Host.Features.Assets;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets;

public class AssetTagRendererTests
{
    private AssetTagRenderer assetTagRenderer;

    public AssetTagRendererTests()
    {
        assetTagRenderer = new AssetTagRenderer();
    }

    [Fact]
    public void Script_ShouldRenderScriptTag()
    {
        assetTagRenderer.Script("path").Should().Be(@"<script type=""text/javascript"" src=""path""></script>");
        assetTagRenderer.Script("path", new Dictionary<string, string> { ["type"] = "type" }).Should().Be(@"<script type=""type"" src=""path""></script>");
        assetTagRenderer.Script("path", new Dictionary<string, string> { ["custom"] = "c" }).Should()
            .Be(@"<script custom=""c"" type=""text/javascript"" src=""path""></script>");
    }

    [Fact]
    public void Link_ShouldRenderLinkTag()
    {
        assetTagRenderer.Link("path").Should().Be(@"<link type=""text/css"" rel=""stylesheet"" href=""path""></link>");
        assetTagRenderer.Link("path", new Dictionary<string, string> { ["type"] = "type" }).Should().Be(@"<link type=""type"" rel=""stylesheet"" href=""path""></link>");
        assetTagRenderer.Link("path", new Dictionary<string, string> { ["rel"] = "rel" }).Should().Be(@"<link rel=""rel"" type=""text/css"" href=""path""></link>");
        assetTagRenderer.Link("path", new Dictionary<string, string> { ["custom"] = "c" }).Should()
            .Be(@"<link custom=""c"" type=""text/css"" rel=""stylesheet"" href=""path""></link>");
    }

    [Fact]
    public void InlineScript_ShouldRenderScriptTag()
    {
        assetTagRenderer.InlineScript("c").Should().Be(@"<script type=""text/javascript"">c</script>");
        assetTagRenderer.InlineScript("c", new Dictionary<string, string> { ["type"] = "type" }).Should().Be(@"<script type=""type"">c</script>");
        assetTagRenderer.InlineScript("c", new Dictionary<string, string> { ["custom"] = "c" }).Should().Be(@"<script custom=""c"" type=""text/javascript"">c</script>");
    }

    [Fact]
    public void InlineStyle_ShouldRenderLinkTag()
    {
        assetTagRenderer.InlineStyle("s").Should().Be(@"<style>s</style>");
        assetTagRenderer.InlineStyle("s", new Dictionary<string, string> { ["custom"] = "c" }).Should().Be(@"<style custom=""c"">s</style>");
    }
}
