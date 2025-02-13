using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.RegistrationDates;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.RegistrationDates;

public sealed class RegistrationDateServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new RegistrationDateServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Account.RegistrationDate);
        target.CacheKey.Should().Be("RegistrationDate"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
