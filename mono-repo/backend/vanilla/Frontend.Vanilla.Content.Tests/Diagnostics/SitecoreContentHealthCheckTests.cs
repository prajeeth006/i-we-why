using System.Threading.Tasks;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Diagnostics;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Diagnostics;

public class SitecoreContentHealthCheckTests
{
    private IHealthCheck target;
    private Mock<IContentRequestFactory> requestFactory;
    private Mock<IContentXmlSource> xmlSource;

    public SitecoreContentHealthCheckTests()
    {
        requestFactory = new Mock<IContentRequestFactory>();
        xmlSource = new Mock<IContentXmlSource>();
        target = new SitecoreContentHealthCheck(requestFactory.Object, xmlSource.Object);
    }

    [Fact]
    public void ShouldExposeCorrectMetadata()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    [Fact]
    public async Task ShouldRetrieveRootNode()
    {
        var request = TestContentRequest.Get();
        var ct = TestCancellationToken.Get();
        var xml = @"<items><item source=""health"" /></items>";

        requestFactory.Setup(f => f.Create("/", 0, false, "", false, false)).Returns(request);
        xmlSource.Setup(s => s.GetContentXmlAsync(ExecutionMode.Async(ct), request.ItemUrl, false, null))
            .ReturnsAsync(new ContentXml(XElement.Parse(xml), default, default));

        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().BeNull();
        dynamic details = result.Details;
        ((object)details.RequestUrl).Should().BeSameAs(request.ItemUrl);
        ((object)details.Response).Should().Be(xml);
    }
}
