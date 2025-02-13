using System;
using System.Threading.Tasks;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Deserialization;

public class DeserializationContentLoaderTestsWithTracing() : DeserializationContentLoaderTests(true) { }

public class DeserializationContentLoaderTestsWithoutTracing() : DeserializationContentLoaderTests(false) { }

public abstract class DeserializationContentLoaderTests : TraceTestsBase
{
    protected DeserializationContentLoaderTests(bool useTrace)
        : base(useTrace)
    {
        xmlSource = new Mock<IContentXmlSource>();
        xmlParser = new Mock<IContentXmlParser>();
        deserializer = new Mock<IDocumentDeserializer>();
        target = new DeserializationContentLoader(xmlSource.Object, xmlParser.Object, deserializer.Object);

        mode = TestExecutionMode.Get();
        request = TestContentRequest.Get();
        xmlResult = new ContentXml(XElement.Parse(@"<items><item source=""sitecore"" /></items>"), TimeSpan.FromSeconds(200), TestTime.GetRandomUtc());
        xmlSource.SetupWithAnyArgs(s => s.GetContentXmlAsync(default, null, default, null))
            .ReturnsAsync(() => xmlResult);
    }

    private IDeserializationContentLoader target;
    private Mock<IContentXmlSource> xmlSource;
    private Mock<IContentXmlParser> xmlParser;
    private Mock<IDocumentDeserializer> deserializer;

    private ExecutionMode mode;
    private ContentRequest request;
    private ContentXml xmlResult;

    [Theory]
    [InlineData(true, false, 66)]
    [InlineData(false, false, 0)]
    [InlineData(false, true, 66)]
    public async Task ShouldLoadAndDeserializeContentWithAllPrefetched(bool useCache, bool bypassPrefetchedCache, int expectedDepth)
    {
        request = TestContentRequest.Get(useCache: useCache, bypassPrefetchedCache: bypassPrefetchedCache);
        var requestedData = TestDocumentSourceData.Get(request.Id);
        var prefetchedData1 = TestDocumentSourceData.Get();
        var prefetchedData2 = TestDocumentSourceData.Get();
        var requestedDoc = Mock.Of<IDocument>(d => d.Metadata == requestedData.Metadata);
        var prefetchedEx1 = new Exception("Oups");
        var prefetchedDoc2 = Mock.Of<IDocument>(d => d.Metadata == prefetchedData2.Metadata);

        xmlParser.Setup(p => p.ParseData(xmlResult.Xml, request.Id.Culture, request.Languages.ContentLanguage, (uint)expectedDepth, xmlResult.SitecoreLoadTime))
            .Returns(new WithPrefetched<DocumentSourceData>(requestedData, new[] { prefetchedData1, prefetchedData2 }));
        deserializer.Setup(d => d.Deserialize(requestedData)).Returns(requestedDoc);
        deserializer.Setup(d => d.Deserialize(prefetchedData1)).Throws(prefetchedEx1);
        deserializer.Setup(d => d.Deserialize(prefetchedData2)).Returns(prefetchedDoc2);

        // Act
        var contents = await target.GetContentsAsync(mode, request, TraceFunc);

        contents.Requested.VerifySuccess(expectedDocument: requestedDoc);
        contents.Prefetched.Should().HaveCount(2);
        contents.Prefetched[0].VerifyInvalid(expectedMetadata: prefetchedData1.Metadata, expectedError: prefetchedEx1.ToString());
        contents.Prefetched[1].VerifySuccess(expectedDocument: prefetchedDoc2);
        xmlSource.Verify(s => s.GetContentXmlAsync(mode, new HttpUri("http://sitecore/content?depth=" + (expectedDepth + 1)), useCache, TraceFunc));
    }

    [Fact]
    public async Task ShouldReturnNotFoundContent_IfNoXmlDownloaded()
    {
        xmlResult = new ContentXml(null, default, default);

        // Act
        var contents = await target.GetContentsAsync(mode, request, TraceFunc);

        contents.Requested.VerifyNotFound(request.Id);
        contents.Prefetched.Should().BeEmpty();
        xmlParser.VerifyWithAnyArgs(p => p.ParseData(null, null, null, default, default), Times.Never);
        deserializer.VerifyWithAnyArgs(d => d.Deserialize(null), Times.Never);
    }
}
