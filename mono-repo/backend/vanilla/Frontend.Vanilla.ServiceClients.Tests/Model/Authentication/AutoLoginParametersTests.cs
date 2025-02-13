using System;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public sealed class AutoLoginParametersTests
{
    private AutoLoginParameters target;

    public AutoLoginParametersTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
        target = new AutoLoginParameters("3hktBbxFxSM");
    }

    [Fact]
    public void Constructor_ShouldInitializeCorrectly()
    {
        target.SsoToken.Should().Be("3hktBbxFxSM");
        target.Language.Should().Be(new CultureInfo("zh-CN"));
        target.InvokersProductId.Should().BeNull();
        target.InvokersSessionToken.Should().BeNull();
        target.IsEmbeddedSession.Should().BeFalse();
        target.Ucid.Should().BeNull();
    }

    [Fact]
    public void SsoToken_ShouldThrow_IfNull()
        => target.Invoking(t => t.SsoToken = null).Should().Throw<ArgumentException>();

    [Fact]
    public void ShouldSerializeCorrectly()
    {
        target.InvokersProductId = "SPORTSBOOK";
        target.InvokersSessionToken = "XYZ";
        target.IsEmbeddedSession = true;
        target.Ucid = "12345abcd";
        target.LoginType = "auto";
        target.TerminalId = "terminal1";

        var json = PosApiSerializationTester.Serialize(target); // Act

        json.Should().BeJson(
            @"{
                shopId: null,
                ssoToken: '3hktBbxFxSM',
                language: 'zh-CN',
                invokersProductId: 'SPORTSBOOK',
                invokersSessionToken: 'XYZ',
                isEmbeddedSession: true,
                terminalId: 'terminal1',
                ucid: '12345abcd',
                loginType: 'auto'
            }");
    }
}
