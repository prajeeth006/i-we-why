using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.LastSessions;

public class LastSessionInformationTests
{
    [Fact]
    public void ShouldDeserialize()
    {
        var target = Deserialize(
            @"{
                ""firstLogin"": false,
                ""lastSession"": {
                    ""loginTimeUTC"": ""/Date(1415267177000)/"",
                    ""logoutTimeUTC"": ""/Date(1415267186000)/""
                }
            }");

        target.IsFirstLogin.Should().BeFalse();
        target.Details.LoginTime.Should().Be(new UtcDateTime(2014, 11, 06, 9, 46, 17));
        target.Details.LogoutTime.Should().Be(new UtcDateTime(2014, 11, 06, 9, 46, 26));
    }

    [Fact]
    public void ShouldDeserialize_IfFirstLogin()
    {
        var target = Deserialize(
            @"{
                ""firstLogin"": true,
                ""lastSession"": null
            }");

        target.IsFirstLogin.Should().BeTrue();
        target.Details.Should().BeNull();
    }

    [Theory]
    [InlineData(@"{ ""firstLogin"": false, ""lastSession"": null }")]
    [InlineData(@"{ ""firstLogin"": true, ""lastSession"": { ""loginTimeUTC"": ""/Date(1415267177000)/"", ""logoutTimeUTC"": ""/Date(1415267186000)/"" } }")]
    public void ShouldThrow_IfInconsistentProperties(string json)
        => new Action(() => Deserialize(json)).Should().Throw<ArgumentException>();

    private static LastSession Deserialize(string json)
        => PosApiSerializationTester.Deserialize<LastSessionDto>(json).GetData();
}
