using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.XmlSources;

public class SitecoreServiceContentXmlSourceTestsA : SitecoreServiceContentXmlSourceTests
{
    public SitecoreServiceContentXmlSourceTestsA()
        : base(true, true) { }
}

public class SitecoreServiceContentXmlSourceTestsB : SitecoreServiceContentXmlSourceTests
{
    public SitecoreServiceContentXmlSourceTestsB()
        : base(false, true) { }
}

public class SitecoreServiceContentXmlSourceTestsC : SitecoreServiceContentXmlSourceTests
{
    public SitecoreServiceContentXmlSourceTestsC()
        : base(true, false) { }
}

public class SitecoreServiceContentXmlSourceTestsD : SitecoreServiceContentXmlSourceTests
{
    public SitecoreServiceContentXmlSourceTestsD()
        : base(false, false) { }
}

public abstract class SitecoreServiceContentXmlSourceTests : TraceTestsBase, IDisposable
{
    private readonly bool useCache;

    public SitecoreServiceContentXmlSourceTests(bool useTrace, bool useCache)
        : base(useTrace)
    {
        this.useCache = useCache;
        restClient = new Mock<IRestClient>();
        config = Mock.Of<IContentConfiguration>(c =>
            c.RequestTimeout == TimeSpan.FromSeconds(7)
            && c.CacheTimes.Default == TimeSpan.FromSeconds(22)
            && c.CacheTimes.NotFoundContent == TimeSpan.FromSeconds(11));
        clock = new TestClock();
        target = new SitecoreServiceContentXmlSource(restClient.Object, config, clock);

        mode = TestExecutionMode.Get();
        requestUrl = new HttpUri("http://sitecore/");
        responseToReturn = new RestResponse(new RestRequest(new HttpUri("http://test"))) { Content = "Test Content".EncodeToBytes() };

        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(default, null)).ReturnsAsync(responseToReturn);
    }

    private IContentXmlSource target;
    private Mock<IRestClient> restClient;
    private IContentConfiguration config;
    private TestClock clock;

    private ExecutionMode mode;
    private HttpUri requestUrl;
    private RestResponse responseToReturn;

    public void Dispose()
        => restClient.Invocations.Single().Arguments.Should().BeEquivalentTo(
            mode,
            new RestRequest(requestUrl) { Timeout = config.RequestTimeout });

    private Func<Task<ContentXml>> Act
        => () => target.GetContentXmlAsync(mode, requestUrl, useCache, TraceFunc);

    [Fact]
    public async Task ShouldReturnXml_IfSuccess()
    {
        const string xmlStr = "<items><item>Hello world</item></items>";
        responseToReturn.Content = xmlStr.EncodeToBytes();

        var result = await Act();

        result.Xml.Should().BeEquivalentTo(XElement.Parse(xmlStr));
        result.RelativeExpiration.Should().Be(config.CacheTimes.Default);
        result.SitecoreLoadTime.Should().Be(clock.UtcNow);
        VerifyTraceWithResponse("Content XML is valid, using default cache time '00:00:22'.");
    }

    [Fact]
    public async Task ShouldReturnEmpty_IfNotFound()
    {
        responseToReturn.StatusCode = HttpStatusCode.NotFound;

        var result = await Act();

        result.Xml.Should().BeNull();
        result.RelativeExpiration.Should().Be(config.CacheTimes.NotFoundContent);
        result.SitecoreLoadTime.Should().Be(clock.UtcNow);
        VerifyTraceWithResponse("Content is not-found, using not-found cache time '00:00:11'.");
    }

    [Theory]
    [InlineData(HttpStatusCode.BadRequest)]
    [InlineData(HttpStatusCode.InternalServerError)]
    [InlineData(HttpStatusCode.Redirect)]
    public void ShouldThrow_IfUnexpectedResponse(HttpStatusCode responseCode)
    {
        responseToReturn.StatusCode = responseCode;

        var ex = RunExceptionTest(); // Act

        ex.Message.Should().Be($"Unexpected Sitecore response {responseToReturn} with body: Test Content");
        VerifyTraceWithResponse(GetFailedTraceMsg(ex));
    }

    [Theory]
    [InlineData("This is gibberish", typeof(XmlException))]
    [InlineData("<xml-but-different />", typeof(ArgumentException))]
    [InlineData("<items><no-real-item /></items>", typeof(ArgumentException))]
    public void ShouldThrow_IfUnexpectedContent(string responseContent, Type expectedInnerExceptionType)
    {
        responseToReturn.Content = responseContent.EncodeToBytes();

        var ex = RunExceptionTest(); // Act

        ex.Message.Should().Be("Invalid content XML: " + responseContent);
        ex.InnerException.Should().BeOfType(expectedInnerExceptionType);
        VerifyTraceWithResponse(GetFailedTraceMsg(ex));
    }

    [Fact]
    public void ShouldWrapNetworkException()
    {
        var networkEx = new Exception("Network error");
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(default, null)).ThrowsAsync(networkEx);

        var ex = RunExceptionTest(); // Act

        ex.Should().BeSameAs(networkEx);
        Trace?.Should().BeEquivalentOrderedTo(RequestTraceMsg, GetFailedTraceMsg(ex));
    }

    private Exception RunExceptionTest()
        => Act.Should().ThrowAsync<Exception>().Result
            .WithMessage(
                "Failed loading content from Sitecore service at 'http://sitecore/'. Check the connection, validity of the response and investigate on Sitecore side.")
            .Which.InnerException;

    private static string GetFailedTraceMsg(Exception ex)
        => $"Failed Sitecore request or response processing: {ex}";

    private const string RequestTraceMsg = "Making GET request to Sitecore URL 'http://sitecore/' with timeout '00:00:07'.";

    private void VerifyTraceWithResponse(string resultMsg)
        => Trace?.Should().BeEquivalentOrderedTo(
            RequestTraceMsg,
            $"Received {responseToReturn} response with following body.",
            responseToReturn.Content.DecodeToString(),
            resultMsg);
}
