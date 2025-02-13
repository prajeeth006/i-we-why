using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public sealed class LoginParametersTests : CommonParametersTests
{
    private LoginParameters target;

    public LoginParametersTests()
        => target = new LoginParameters("Chuck Norris", "Hail To The King, Baby");

    [Fact]
    public void ShouldSetupCommon()
    {
        ShouldHaveCorrectCommonProperties(target);
    }

    [Fact]
    public void Constructor_ShouldCreate()
    {
        target.Username.Should().Be("Chuck Norris");
        target.Password.Should().Be("Hail To The King, Baby");
        target.DateOfBirth.Should().BeNull();
        target.HandshakeSessionKey.Should().BeNull();
        target.LoginType.Should().BeNull();
    }

    [Theory, BooleanData]
    public void Password_AllowWhiteSpace(bool useCtor)
    {
        if (useCtor)
            target = new LoginParameters("Chuck Norris", "  ");
        else
            target.Password = "  ";

        target.Password.Should().Be("  ");
    }

    [Theory, BooleanData]
    public void Serialization_ShouldBeCorrect(bool rememberMe)
    {
        target.DateOfBirth = new DateTime(2011, 9, 14, 10, 33, 2, DateTimeKind.Utc);
        target.HandshakeSessionKey = "7401fefbad9a4f87a40e5d54930c285d";
        target.LoginType = "MagicCard";
        target.RememberMe = rememberMe;

        RunSerializationTest(target, $@"{{
                username: 'Chuck Norris',
                password: 'Hail To The King, Baby',
                dateOfBirth: '/Date(1315996382000)/',
                handshakeSessionKey: '7401fefbad9a4f87a40e5d54930c285d',
                loginType: 'MagicCard',
                rememberMe: {rememberMe.ToString().ToLower()},
                terminalId: null,
                shopId: null,
                {CommonJsonProperties},
                vanillaIdToken: null,
            }}");
    }

    [Fact]
    public void Serialization_ShouldOmitSomeProperties_IfDefaultValue()
    {
        RunSerializationTest(target, $@"{{
                username: 'Chuck Norris',
                password: 'Hail To The King, Baby',
                loginType: null,
                rememberMe: false,
                terminalId: null,
                shopId: null,
                {CommonJsonProperties},
                vanillaIdToken: null,
            }}");
    }
}
