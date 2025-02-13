using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Features.WebIntegration.ServiceClients;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.ServiceClients;

public class TracingCorrelationPosApiRestRequestBuilderTests
{
    private IPosApiRestRequestBuilder target;
    private Mock<ITracingIdsProvider> tracingIdsProvider;

    private RestRequest restRequest;
    private PosApiRestRequest posApiRequest;

    public TracingCorrelationPosApiRestRequestBuilderTests()
    {
        tracingIdsProvider = new Mock<ITracingIdsProvider>();
        target = new TracingCorrelationPosApiRestRequestBuilder(tracingIdsProvider.Object);

        restRequest = new RestRequest(new HttpUri("http://api.bwin.com"));
        posApiRequest = new PosApiRestRequest(new PathRelativeUri("data"));
    }

    [Fact]
    public void ShouldAddHeader()
    {
        tracingIdsProvider.Setup(p => p.GetTracingIds()).Returns(("x", "y", false, "testTrace"));

        target.PrepareRestRequest(restRequest, posApiRequest); // Act

        restRequest.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues> { { HttpHeaders.TraceParent, "testTrace" } });
    }
}
