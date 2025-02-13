using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public class ExtendedApiRestRequestBuilderTests
{
    private ExtendedServiceClientsConfiguration config;
    private PosApiRestRequest request;
    private RestRequest restRequest;

    public ExtendedApiRestRequestBuilderTests()
    {
        config = new ExtendedServiceClientsConfiguration { Host = new HttpUri("http://www.xpos.com"), Version = "v3" };
        request = new ExtendedApiRestRequest(new PathRelativeUri("path"));
        restRequest = new RestRequest(new HttpUri("http://test"));
    }

    private IPosApiRestRequestBuilder GetTarget()
        => new ExtendedApiRestRequestBuilder(config);

    [Fact]
    public void ShouldConvertRequest()
    {
        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Url.ToString().Should().Be("http://www.xpos.com/v3/path");
    }
}
