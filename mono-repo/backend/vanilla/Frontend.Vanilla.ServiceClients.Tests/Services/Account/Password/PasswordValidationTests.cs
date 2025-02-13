using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.Password;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.Password;

public class PasswordValidationTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<PasswordValidation>(@"{
                ""validationRequired"": true
            }");

        target.ValidationRequired.Should().BeTrue();
    }
}
