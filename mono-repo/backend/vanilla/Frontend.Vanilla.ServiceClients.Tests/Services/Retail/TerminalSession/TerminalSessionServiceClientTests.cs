using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Retail.TerminalSession;
using FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Retail.TerminalSession;

public class TerminalSessionServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new TerminalSessionServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Retail.TerminalSession);
        target.CacheKey.Should().Be("TerminalSession");
    }
}
