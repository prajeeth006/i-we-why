using System;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public class PosApiRestRequestFactoryTests
{
    private IPosApiRestRequestFactory target;
    private Mock<IPosApiRestRequestBuilder> builder1;
    private Mock<IPosApiRestRequestBuilder> builder2;
    private PosApiRestRequest posApiRestRequest;

    public PosApiRestRequestFactoryTests()
    {
        var config = new ServiceClientsConfigurationBuilder { AccessId = "abc" }.Build();
        builder1 = new Mock<IPosApiRestRequestBuilder>();
        builder2 = new Mock<IPosApiRestRequestBuilder>();
        target = new PosApiRestRequestFactory(config, new[] { builder1.Object, builder2.Object });

        posApiRestRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Method"));
    }

    [Fact]
    public void ShouldCreateRequestCorrectly()
    {
        var method = new HttpMethod("FUCK");
        posApiRestRequest.Method = method;

        var result = target.CreateRestRequest(posApiRestRequest); // Act

        result.Url.Should().Be(new Uri("https://api.bwin.com/V3/Service.svc/Method"));
        result.Method.Should().BeSameAs(method);
        builder1.Verify(b => b.PrepareRestRequest(result, posApiRestRequest));
        builder2.Verify(b => b.PrepareRestRequest(result, posApiRestRequest));
    }
}
