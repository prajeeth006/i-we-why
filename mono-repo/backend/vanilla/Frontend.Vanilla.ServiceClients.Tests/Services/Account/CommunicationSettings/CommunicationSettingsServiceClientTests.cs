using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.CommunicationSettings;

public sealed class CommunicationSettingsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new CommunicationSettingsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Account.CommunicationSettings);
        target.CacheKey.Should().Be("CommunicationSettings"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
