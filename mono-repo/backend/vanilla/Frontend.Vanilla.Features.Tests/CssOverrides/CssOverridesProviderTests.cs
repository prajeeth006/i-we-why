using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.CssOverrides;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.CssOverrides;

public class CssOverridesProviderTests
{
    private ICssOverridesProvider target;
    private Mock<IContentService> contentService;
    private VanillaVersion vanillaVersion;

    private Mock<IFolder> root;
    private Mock<IPCComponentFolder> folder;
    private Mock<IStaticFileTemplate> style1;
    private Mock<IStaticFileTemplate> style2;

    public CssOverridesProviderTests()
    {
        contentService = new Mock<IContentService>();
        vanillaVersion = new VanillaVersion(5, 4, 3, 2, "dev");

        target = new CssOverridesProvider(contentService.Object, vanillaVersion);

        folder = new Mock<IPCComponentFolder>();
        folder.Setup(i => i.Metadata.Id).Returns("root/folder");
        folder.SetupGet(i => i.Condition).Returns("TRUE");
        style1 = new Mock<IStaticFileTemplate>();
        style1.Setup(i => i.Content).Returns("CSS1");
        style1.Setup(i => i.Metadata.Id).Returns("root/style1");
        style1.SetupGet(i => i.Condition).Returns("TRUE");
        style2 = new Mock<IStaticFileTemplate>();
        style2.Setup(i => i.Content).Returns("CSS2");
        style2.Setup(i => i.Metadata.Id).Returns("root/style2");
        style2.SetupGet(i => i.Condition).Returns("c.Request.AbsolutePath MATCHES 'page'");

        root = new Mock<IFolder>();
        root.Setup(i => i.Metadata.Id).Returns("root");

        contentService.Setup(c => c.GetRequired<IFolder>("App-v1.0/CssOverrides/van5", It.IsAny<ContentLoadOptions>())).Returns(root.Object);
        contentService.Setup(c => c.GetChildren<IDocument>(root.Object, It.IsAny<ContentLoadOptions>())).Returns(new IDocument[] { folder.Object, style1.Object });
        contentService.Setup(c => c.GetChildren<IDocument>(folder.Object, It.IsAny<ContentLoadOptions>())).Returns(new IDocument[] { style2.Object });
    }

    [Fact]
    public void ShouldRenderInlineStylesFromSitecoreFolderBasedOnMajorVersion()
    {
        var css = target.Get().ToArray();

        css[0].Content.Should().Be("CSS1");
        css[1].Content.Should().Be("CSS2");
    }

    [Fact]
    public void ShouldSanitizeCssToDisallowScripts()
    {
        style1.Setup(i => i.Content).Returns("</style><script>console.log('HACK')</script><style>");

        var css = target.Get().ToArray();

        css[0].Content.Should().Be("console.log('HACK')");
    }

    [Fact]
    public void ShouldReturnEmptyStringIfNoContentMatches()
    {
        contentService.Setup(c => c.GetChildren<IDocument>(root.Object, It.IsAny<ContentLoadOptions>())).Returns(new IDocument[] { });

        var css = target.Get();

        css.Count().Should().Be(0);
    }
}
