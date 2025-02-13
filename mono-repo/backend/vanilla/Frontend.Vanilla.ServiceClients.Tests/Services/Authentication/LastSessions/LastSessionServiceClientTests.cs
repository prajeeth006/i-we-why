using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.LastSessions;

public class LastSessionInformationServiceClientTests
{
    [Fact]
    public void ShouldCallCorrectUrl()
    {
        var target = new LastSessionServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Authentication.LastSession);
        target.CacheKey.Should().Be("LastSession"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
