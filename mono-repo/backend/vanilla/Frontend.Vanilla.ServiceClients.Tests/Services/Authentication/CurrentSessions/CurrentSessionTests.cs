using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.CurrentSessions;

public class CurrentSessionTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<CurrentSessionDto>(@"{
                ""isAutomaticLogoutRequired"": true,
                ""startTimeUTC"": ""/Date(1415267177020)/"",
                ""expirationTimeUTC"": ""/Date(1415267186043)/""
            }").GetData();

        target.IsAutomaticLogoutRequired.Should().BeTrue();
        target.StartTime.Should().Be(new UtcDateTime(2014, 11, 06, 9, 46, 17, 20));
        target.ExpirationTime.Should().Be(new UtcDateTime(2014, 11, 06, 9, 46, 26, 43));
    }
}
