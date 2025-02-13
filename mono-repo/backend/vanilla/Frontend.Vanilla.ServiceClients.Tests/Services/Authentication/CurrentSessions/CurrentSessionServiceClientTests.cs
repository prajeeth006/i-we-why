using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.CurrentSessions;

public class CurrentSessionServiceClientTests
{
    [Fact]
    public void ShouldCallCorrectUrl()
    {
        var target = new CurrentSessionServiceClient(Mock.Of<IPosApiRestClient>());
        target.DataUrl.Should().Be(PosApiEndpoint.Authentication.CurrentSession);
    }
}
