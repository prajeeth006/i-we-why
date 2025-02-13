using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.InvitationUrl;

public class InvitationUrlServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new InvitationUrlServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.InvitationUrl);
        target.CacheKey.Should().Be("InvitationUrl");
    }
}
