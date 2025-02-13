using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Caching;

public class PreCachingContentLoaderTestsWithTracing() : PreCachingContentLoaderTests(true) { }

public class PreCachingContentLoaderTestsWithoutTracing() : PreCachingContentLoaderTests(false) { }

public abstract class PreCachingContentLoaderTests : TraceTestsBase
{
    protected PreCachingContentLoaderTests(bool useTrace)
        : base(useTrace)
    {
        deserializationLoader = new Mock<IDeserializationContentLoader>();
        preCachingProcessor1 = new Mock<IPreCachingContentProcessor>();
        preCachingProcessor2 = new Mock<IPreCachingContentProcessor>();
        target = new PreCachingContentLoader(deserializationLoader.Object, new[] { preCachingProcessor1.Object, preCachingProcessor2.Object });

        mode = TestExecutionMode.Get();
        request = TestContentRequest.Get();
    }

    private IPreCachingContentLoader target;
    private Mock<IDeserializationContentLoader> deserializationLoader;
    private Mock<IPreCachingContentProcessor> preCachingProcessor1;
    private Mock<IPreCachingContentProcessor> preCachingProcessor2;

    private ExecutionMode mode;
    private ContentRequest request;

    [Theory, ClassData(typeof(NotSuccessStatuses))]
    public async Task ShouldProcessAllContentsByAllProcessors(DocumentStatus notSuccessStatus)
    {
        // ContentA: Success, fully processed, added JIT processors
        var contentA = TestContent.GetSuccess();
        var processedA1 = TestContent.GetSuccess();
        var processedA2 = TestContent.GetSuccess();
        var jitProcessorA1 = Mock.Of<IJustInTimeContentProcessor>();
        var jitProcessorA2 = Mock.Of<IJustInTimeContentProcessor>();
        var jitProcessorA3 = Mock.Of<IJustInTimeContentProcessor>();
        Setup(preCachingProcessor1, contentA, new[] { jitProcessorA1, jitProcessorA2 }, processedA1);
        Setup(preCachingProcessor2, processedA1, new[] { jitProcessorA3 }, processedA2);

        // ContentB: Not success from beginning
        var contentB = TestContent.Get<IDocument>(notSuccessStatus);

        // ContentC: Success, turned not-success by first processor, further processing should stop
        var contentC = TestContent.GetSuccess();
        var processedC = TestContent.Get<IDocument>(notSuccessStatus);
        var jitProcessorC = Mock.Of<IJustInTimeContentProcessor>();
        Setup(preCachingProcessor1, contentC, new[] { jitProcessorC }, processedC);

        var relExpiration = TimeSpan.FromSeconds(666);
        deserializationLoader.Setup(l => l.GetContentsAsync(mode, request, TraceFunc)).ReturnsAsync(
            new WithPrefetched<Content<IDocument>>(contentA, new[] { contentB, contentC }, relExpiration));

        // Act
        var results = await target.GetContentsAsync(mode, request, TraceFunc);

        results.Requested.Content.Should().BeSameAs(processedA2);
        results.Requested.JustInTimeProcessors.Should().Equal(jitProcessorA1, jitProcessorA2, jitProcessorA3);
        results.Prefetched.Should().HaveCount(2);
        results.Prefetched[0].Content.Should().BeSameAs(contentB);
        results.Prefetched[0].JustInTimeProcessors.Should().BeEmpty();
        results.Prefetched[1].Content.Should().BeSameAs(processedC);
        results.Prefetched[1].JustInTimeProcessors.Should().BeEmpty();
    }

    [Theory, ClassData(typeof(NotSuccessStatuses))]
    public async Task ShouldNotProcessPrefetchedContentByProcessorsWhenSpecified(DocumentStatus notSuccessStatus)
    {
        request = TestContentRequest.Get(bypassContentProcessors: true);
        // ContentA: Success, fully processed, added JIT processors
        var contentA = TestContent.GetSuccess();
        var processedA1 = TestContent.GetSuccess();
        var processedA2 = TestContent.GetSuccess();
        var jitProcessorA1 = new Mock<IJustInTimeContentProcessor>();
        var jitProcessorA2 = Mock.Of<IJustInTimeContentProcessor>();
        var jitProcessorA3 = Mock.Of<IJustInTimeContentProcessor>();
        Setup(preCachingProcessor1, contentA, new[] { jitProcessorA1.Object, jitProcessorA2 }, processedA1);
        Setup(preCachingProcessor2, processedA1, new[] { jitProcessorA3 }, processedA2);

        // ContentB: Not success from beginning
        var contentB = TestContent.Get<IDocument>(notSuccessStatus);

        // ContentC: Success, turned not-success by first processor, further processing should stop
        var contentC = TestContent.GetSuccess();
        var processedC = TestContent.Get<IDocument>(notSuccessStatus);
        var jitProcessorC = Mock.Of<IJustInTimeContentProcessor>();
        Setup(preCachingProcessor1, contentC, new[] { jitProcessorC }, processedC);

        var relExpiration = TimeSpan.FromSeconds(666);
        deserializationLoader.Setup(l => l.GetContentsAsync(mode, request, TraceFunc)).ReturnsAsync(
            new WithPrefetched<Content<IDocument>>(contentA, new[] { contentB, contentC }, relExpiration));

        // Act
        var results = await target.GetContentsAsync(mode, request, TraceFunc);

        preCachingProcessor1.Verify(x => x.ProcessAsync(mode, It.IsAny<SuccessContent<IDocument>>(), It.IsAny<ICollection<IJustInTimeContentProcessor>>(), TraceFunc), Times.Once);
        preCachingProcessor2.Verify(x => x.ProcessAsync(mode, It.IsAny<SuccessContent<IDocument>>(), It.IsAny<ICollection<IJustInTimeContentProcessor>>(), TraceFunc), Times.Once);
    }

    private void Setup(
        Mock<IPreCachingContentProcessor> processor,
        SuccessContent<IDocument> input,
        IJustInTimeContentProcessor[] jitProcessorsToAdd,
        Content<IDocument> result)
        => processor.Setup(p => p.ProcessAsync(mode, input, It.IsAny<ICollection<IJustInTimeContentProcessor>>(), TraceFunc))
            .Callback((ExecutionMode _, SuccessContent<IDocument> c, ICollection<IJustInTimeContentProcessor> p, Action<object> t) => p.Add(jitProcessorsToAdd))
            .ReturnsAsync(result);
}
