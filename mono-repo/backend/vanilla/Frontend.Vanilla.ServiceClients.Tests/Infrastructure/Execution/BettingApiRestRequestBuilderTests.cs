using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public class BettingApiRestRequestBuilderTests
{
    private readonly BettingServiceClientsConfiguration config;
    private readonly IServiceClientsConfiguration serviceClientsConfiguration;
    private readonly PosApiRestRequest request;
    private readonly RestRequest restRequest;

    public BettingApiRestRequestBuilderTests()
    {
        config = new BettingServiceClientsConfiguration { Host = new HttpUri("http://www.bpos.com"), Version = "v3" };
        var timeoutRules = new[] { new ServiceClientTimeoutRule(".*", TimeSpan.FromSeconds(30)) };
        serviceClientsConfiguration = new ServiceClientsConfiguration(new ServiceClientsConfigurationBuilder
            { AccessId = "secret-key", TimeoutRules = timeoutRules });
        request = new BettingApiRestRequest(new PathRelativeUri("path"));
        restRequest = new RestRequest(new HttpUri("http://test"));
    }

    private IPosApiRestRequestBuilder GetTarget()
        => new BettingApiRestRequestBuilder(config, serviceClientsConfiguration);

    [Fact]
    public void ShouldConvertRequest()
    {
        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Url.ToString().Should().Be("http://www.bpos.com/v3/path");
    }

    [Fact]
    public void ShouldSetTimeoutToRequest()
    {
        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Timeout.ToString().Should().Be("00:00:30");
    }
}
