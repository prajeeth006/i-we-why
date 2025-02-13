using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Content.Loading.JustInTime;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.JustInTime;

public class JustInTimeContentLoaderTestsWithTracing() : JustInTimeContentLoaderTests(true) { }

public class JustInTimeContentLoaderTestsWithoutTracing() : JustInTimeContentLoaderTests(false) { }

public abstract class JustInTimeContentLoaderTests : TraceTestsBase
{
    protected JustInTimeContentLoaderTests(bool useTrace)
        : base(useTrace)
    {
        cachedLoader = new Mock<ICachedContentLoader>();
        requestFactory = new Mock<IContentRequestFactory>();
        target = new JustInTimeContentLoader(cachedLoader.Object, requestFactory.Object);

        id = TestDocumentId.Get();
        mode = TestExecutionMode.Get();
        request = TestContentRequest.Get();
        options = TestContentLoadOptions.Get();
        jitProcessor1 = new Mock<IJustInTimeContentProcessor>();
        jitProcessor2 = new Mock<IJustInTimeContentProcessor>();

        requestFactory.Setup(f => f.Create(id, options.PrefetchDepth, options.BypassCache, options.Revision, options.BypassPrefetchedProcessing, options.BypassChildrenCache)).Returns(request);
    }

    private readonly IContentLoader target;
    private readonly Mock<ICachedContentLoader> cachedLoader;
    private readonly Mock<IContentRequestFactory> requestFactory;

    private readonly DocumentId id;
    private readonly ExecutionMode mode;
    private readonly ContentRequest request;
    private readonly ContentLoadOptions options;
    private readonly Mock<IJustInTimeContentProcessor> jitProcessor1;
    private readonly Mock<IJustInTimeContentProcessor> jitProcessor2;

    private async Task RunAsync(
        Content<IDocument> inputContent,
        Content<IDocument> expectedContent,
        bool expectedProcessor1Called = true,
        bool expectedProcessor2Called = true)
    {
        cachedLoader.Setup(l => l.GetContentsAsync(mode, request, TraceFunc))
            .ReturnsAsync(new CachedContent(inputContent, new[] { jitProcessor1.Object, jitProcessor2.Object }));

        // Act
        var result = await target.GetContentAsync(mode, id, options, TraceFunc);

        result.Should().BeSameAs(expectedContent);
        jitProcessor1.VerifyWithAnyArgs(p => p.ProcessAsync(default, null, default, null, null), Times.Exactly(expectedProcessor1Called ? 1 : 0));
        jitProcessor2.VerifyWithAnyArgs(p => p.ProcessAsync(default, null, default, null, null), Times.Exactly(expectedProcessor2Called ? 1 : 0));

        Trace?.Should().BeEquivalentOrderedTo(
            $"Loading {id} with following options.",
            options,
            "Determined following details of the request to Sitecore",
            request);
    }

    [Fact]
    public async Task ShouldExecuteAllJitProcessors()
    {
        var content = TestContent.GetSuccess();
        var processed1 = TestContent.GetSuccess();
        var processed2 = TestContent.GetSuccess();
        jitProcessor1.Setup(p => p.ProcessAsync(mode, content, options, target, TraceFunc)).ReturnsAsync(processed1);
        jitProcessor2.Setup(p => p.ProcessAsync(mode, processed1, options, target, TraceFunc)).ReturnsAsync(processed2);

        await RunAsync(
            inputContent: content,
            expectedContent: processed2);
    }

    [Theory, ClassData(typeof(NotSuccessStatuses))]
    public async Task ShouldStopExecution_IfProcessorReturnsNotSuccess(DocumentStatus status)
    {
        var content = TestContent.GetSuccess();
        var processedNotSuccess = TestContent.Get<IDocument>(status);
        jitProcessor1.Setup(p => p.ProcessAsync(mode, content, options, target, TraceFunc)).ReturnsAsync(processedNotSuccess);

        await RunAsync(
            inputContent: content,
            expectedContent: processedNotSuccess,
            expectedProcessor2Called: false);
    }

    [Theory, ClassData(typeof(NotSuccessStatuses))]
    public async Task ShouldReturnSameContent_IfNotSuccess(DocumentStatus status)
    {
        var notSuccess = TestContent.Get<IDocument>(status);

        await RunAsync(
            inputContent: notSuccess,
            expectedContent: notSuccess,
            expectedProcessor1Called: false,
            expectedProcessor2Called: false);
    }
}
