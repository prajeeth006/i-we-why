using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.ProxyFolder;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Content.Tests.Loading.Proxy;
using Moq;
using Xunit;
using Enumerable = System.Linq.Enumerable;

namespace Frontend.Vanilla.Content.Tests.Loading.ProxyFolder;

public class ProxyFolderPreCachingContentProcessorTestsWithTracing() : ProxyFolderPreCachingContentProcessorTests(true) { }

public class ProxyFolderPreCachingContentProcessorTestsWithoutTracing() : ProxyPreCachingContentProcessorTests(false) { }

public abstract class ProxyFolderPreCachingContentProcessorTests : PreCachingContentProcessorTestsBase
{
    protected ProxyFolderPreCachingContentProcessorTests(bool useTrace)
        : base(useTrace)
    {
        Target = new ProxyFolderPreCachingContentProcessor();

        proxy = new Mock<IProxyFolder>();

        proxy.SetupGet(p => p.Metadata).Returns(Metadata.Object);
        InputContent = new SuccessContent<IDocument>(proxy.Object);
    }

    private Mock<IProxyFolder> proxy;

    [Fact]
    public void ShouldReturnSameContent_IfNotProxy()
    {
        SetupContentFields(); // Sets up PCText

        RunAndExpectSameContent(); // Act

        Trace?.Single().Should().Be(ProxyFolderPreCachingContentProcessor.TraceMessages.NotProxyFolder);
    }

    [Fact]
    public void ShouldReturnFilteredContent_IfNoChildren()
    {
        proxy.SetupGet(p => p.Metadata.ChildIds).Returns(Enumerable.Empty<DocumentId>().ToList());

        var result = Target_Process(); // Act

        result.VerifyFiltered(expectedMetadata: InputContent.Metadata);
        Trace?.Single().Should().Be(ProxyFolderPreCachingContentProcessor.TraceMessages.NoChildren);
    }

    [Fact]
    public void ShouldReturnSuccessContent_IfItHasChildren()
    {
        proxy.SetupGet(p => p.Metadata.ChildIds).Returns(new List<DocumentId> { new ("/test") });

        var result = Target_Process(); // Act

        result.VerifySuccess(expectedMetadata: InputContent.Metadata);
    }
}
