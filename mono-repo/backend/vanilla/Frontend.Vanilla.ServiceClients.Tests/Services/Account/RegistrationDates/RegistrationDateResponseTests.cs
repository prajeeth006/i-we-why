using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.RegistrationDates;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.RegistrationDates;

public class RegistrationDateResponseTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        var json = "{\"registrationDate\": \"/Date(466343448000)/\"}";
        var response = PosApiSerializationTester.Deserialize<RegistrationDateResponse>(json).GetData();

        response.Value.Should().Be(new DateTime(1984, 10, 11, 11, 50, 48));
    }
}
