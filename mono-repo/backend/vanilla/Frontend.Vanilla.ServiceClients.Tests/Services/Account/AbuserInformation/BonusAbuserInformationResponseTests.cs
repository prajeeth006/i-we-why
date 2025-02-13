using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.AbuserInformation;

public sealed class BonusAbuserInformationServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new BonusAbuserInformationServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Account.GetDnaAbuserInformation);
        target.CacheKey.Should().Be("DnaAbuserInformation"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
