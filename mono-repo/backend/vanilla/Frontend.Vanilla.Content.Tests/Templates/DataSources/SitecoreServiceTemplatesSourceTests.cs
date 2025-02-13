using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.DataSources;

public class SitecoreServiceTemplatesSourceTests
{
    private ISitecoreServiceTemplatesSource target;
    private TestRestClient restClient;
    private Mock<ISitecoreServiceTemplatesXmlParser> xmlParser;
    private Mock<IHttpClientFactory> httpClientFactory;

    private List<string> trace;
    private ExecutionMode mode;

    public SitecoreServiceTemplatesSourceTests()
    {
        httpClientFactory = new Mock<IHttpClientFactory>();
        restClient = new TestRestClient(httpClientFactory.Object);
        var config = new ContentConfigurationBuilder
        {
            Host = new Uri("http://sitecore/"),
            Version = "V66",
            TemplatePaths = new[] { "/Vanilla", "/Sports" },
        };
        xmlParser = new Mock<ISitecoreServiceTemplatesXmlParser>();
        target = new SitecoreServiceTemplatesSource(restClient, config.Build(), xmlParser.Object);

        trace = new List<string>();
        mode = TestExecutionMode.Get();
    }

    [Theory, BooleanData]
    public async Task ShouldLoadAndMergeAllTemplates(bool verbose)
    {
        restClient.Setup("Vanilla", responseContent: @"<templates>
                <template id='vanilla-1' />
                <template id='vanilla-2' />
                <ignored />
            </templates>");
        restClient.Setup("Sports", responseContent: @"<templates>
                <template id='sports-1' />
                <unrelated />
                <template id='sports-2' />
            </templates>");

        var parsedTemplates = Mock.Of<IReadOnlyList<SitecoreTemplate>>();
        var expectedFullXml = XElement.Parse(@"<templates>
                <template id='vanilla-1' />
                <template id='vanilla-2' />
                <template id='sports-1' />
                <template id='sports-2' />
            </templates>");
        var expectedTrace = verbose ? new Action<string>(trace.Add) : SitecoreServiceTemplatesSource.DisabledTrace;
        xmlParser.Setup(p => p.Parse(It.Is<XElement>(x => XNode.DeepEquals(x, expectedFullXml)), expectedTrace)).Returns(parsedTemplates);

        // Act
        var result = await target.GetTemplatesAsync(mode, trace.Add, verbose);

        result.Should().BeSameAs(parsedTemplates);
        restClient.Executed.Should().HaveCount(2);
        restClient.Executed.Select(e => e.Request.Url.AbsoluteUri).Should().BeEquivalentTo(
            "http://sitecore/V66/template/.aspx?xml=1&templates=%2FVanilla",
            "http://sitecore/V66/template/.aspx?xml=1&templates=%2FSports");
        restClient.Executed.Each(e => e.Mode.Should().Be(mode));

        trace.Should().Equal(verbose
            ? new[]
            {
                "Paths from which to load templates: '/Vanilla', '/Sports'.",
                "Loading templates from URL 'http://sitecore/V66/template/.aspx?xml=1&templates=%2FVanilla'.",
                "Loading templates from URL 'http://sitecore/V66/template/.aspx?xml=1&templates=%2FSports'.",
                "All template XMLs fetched successfully.",
            }
            : new[]
            {
                "Loading templates from URL 'http://sitecore/V66/template/.aspx?xml=1&templates=%2FVanilla'.",
                "Loading templates from URL 'http://sitecore/V66/template/.aspx?xml=1&templates=%2FSports'.",
            });
    }

    [Fact]
    public void ShouldThrow_IfNotSuccessResponse()
    {
        restClient.Setup(responseCode: HttpStatusCode.ServiceUnavailable, responseContent: "We are sleeping.");

        var ex = RunExceptionTest(); // Act

        ex.Message.Should().Be("Request for Sitecore templates returned unexpected 503 ServiceUnavailable with body: We are sleeping.");
    }

    [Fact]
    public void ShouldThrow_IfNetworkError()
    {
        var networkEx = new Exception("Network error.");
        restClient.Setups.Add(r => throw networkEx);

        var ex = RunExceptionTest(); // Act

        ex.Should().BeSameAs(networkEx);
    }

    [Fact]
    public void ShouldThrow_IfInvalidXml()
    {
        restClient.Setup(responseContent: "Gibberish.");

        var ex = RunExceptionTest(); // Act

        ex.Should().BeOfType<XmlException>();
    }

    private Exception RunExceptionTest()
        => new Func<Task>(() => target.GetTemplatesAsync(mode, trace.Add, true)) // Act
            .Should().ThrowAsync<Exception>().Result
            .WithMessage("Failed loading Sitecore templates from URL 'http://sitecore/V66/template/.aspx?xml=1&templates=%2FVanilla'.")
            .Which.InnerException;
}
