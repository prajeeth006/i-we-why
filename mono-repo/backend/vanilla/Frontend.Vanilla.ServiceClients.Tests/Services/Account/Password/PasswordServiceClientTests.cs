using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.Password;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.Password;

public class PasswordServiceClientTests
{
    [Fact]
    public void ShouldCallCorrectUrl()
    {
        var target = new PasswordServiceClient(Mock.Of<IPosApiRestClient>());
        target.DataUrl.Should().Be(PosApiEndpoint.Account.PasswordValidationRequired);
    }
}
