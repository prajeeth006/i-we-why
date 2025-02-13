using FluentAssertions;
using Frontend.Host.Features.HtmlInjection;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Net;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.HtmlInjection;

public class SiteScriptsRendererTests
{
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private static readonly DocumentId TestScriptDocument = new DocumentId("/content-v1.0/scripts", id: "test");

    private SiteScriptsRenderer renderer;

    public SiteScriptsRendererTests()
    {
        contentService = new Mock<IContentService>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();

        renderer = new SiteScriptsRenderer(contentService.Object, internalRequestEvaluator.Object);
    }

    private void SetupContent(params IPCScript[] scripts)
        => contentService.Setup(s => s.GetChildrenAsync<IPCScript>("App-v1.0/SiteScripts", CancellationToken.None, default)).ReturnsAsync(scripts);

    private static IPCScript CreateScript(string reference = null!, string code = null!, SiteScriptsPosition position = SiteScriptsPosition.Top)
    {
        var script = new Mock<IPCScript>();
        script.SetupGet(s => s.Reference).Returns(reference != null ? new ContentLink(new Uri(reference), null, ContentParameters.Empty) : null);
        script.SetupGet(s => s.Code).Returns(code);
        script.SetupGet(s => s.Metadata.Id).Returns(TestScriptDocument);
        script.SetupGet(s => s.IsFooter).Returns(position == SiteScriptsPosition.Bottom);

        return script.Object;
    }

    [Fact]
    public async Task ShallRenderScriptReference()
    {
        SetupContent(CreateScript(reference: "http://bwin/script.js"));

        // Act
        var result = await renderer.RenderAsync(SiteScriptsPosition.Top, CancellationToken.None);

        result.Should().NotBeNull();
        result.Should().Contain(@"<script src=""http://bwin/script.js""></script>");
    }

    [Fact]
    public async Task ShallRenderScriptSnippet()
    {
        SetupContent(CreateScript(code: "alert('Hello BWIN');"));

        // Act
        var result = await renderer.RenderAsync(SiteScriptsPosition.Top, CancellationToken.None);

        result.Should().NotBeNull();
        result.Should().Contain(@"<script>alert('Hello BWIN');</script>");
    }

    [Fact]
    public async Task ShallConcatenateScripts()
    {
        SetupContent(CreateScript(code: "alert('1');"), CreateScript(code: "alert('2');"));

        // Act
        var result = await renderer.RenderAsync(SiteScriptsPosition.Top, CancellationToken.None);

        result.Should().NotBeNull();
        result.Should().Contain(@"<script>alert('1');</script>");
        result.Should().Contain(@"<script>alert('2');</script>");
    }

    [Theory]
    [InlineData(SiteScriptsPosition.Top)]
    [InlineData(SiteScriptsPosition.Bottom)]
    public async Task ShallFilterScriptsByPosition(SiteScriptsPosition position)
    {
        SetupContent(
            CreateScript(reference: "http://bwin/header.js", position: SiteScriptsPosition.Top),
            CreateScript(reference: "http://bwin/footer.js", position: SiteScriptsPosition.Bottom));

        // Act
        var result = await renderer.RenderAsync(position, CancellationToken.None);

        result.Should().NotBeNull();

        if (position == SiteScriptsPosition.Top)
        {
            result.Should().Contain(@"<script src=""http://bwin/header.js""></script>");
            result.Should().NotContain(@"<script src=""http://bwin/footer.js""></script>");
        }
        else
        {
            result.Should().NotContain(@"<script src=""http://bwin/header.js""></script>");
            result.Should().Contain(@"<script src=""http://bwin/footer.js""></script>");
        }
    }

    [Fact]
    public async Task ShallPreferScriptReferenceOverCode()
    {
        SetupContent(CreateScript(code: "alert('Hello BWIN');", reference: "http://bwin/script.js"));

        // Act
        var result = await renderer.RenderAsync(SiteScriptsPosition.Top, CancellationToken.None);

        result.Should().NotBeNull();
        result.Should().Contain(@"<script src=""http://bwin/script.js""></script>");
        result.Should().NotContain(@"alert('Hello BWIN');");
    }

    [Fact]
    public async Task ShallHandleMissingScriptProperties()
    {
        SetupContent(Mock.Of<IPCScript>());

        // Act
        var result = await renderer.RenderAsync(SiteScriptsPosition.Top, CancellationToken.None);

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    public async Task ShallHandleEmptyScriptProperties(string code)
    {
        SetupContent(CreateScript(reference: null!, code));

        // Act
        var result = await renderer.RenderAsync(SiteScriptsPosition.Top, CancellationToken.None);

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }
}
