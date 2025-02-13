using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.FraudProtection;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.FraudProtection;

public class SeonClientConfigurationProviderTests : ClientConfigProviderTestsBase
{
    private ISeonConfiguration seonConfiguration;

    public SeonClientConfigurationProviderTests()
    {
        seonConfiguration = Mock.Of<ISeonConfiguration>(c =>
            c.Enabled == true &&
            c.EnableAudioFingerprint == true &&
            c.EnableCanvasFingerprint == true &&
            c.EnableWebGLFingerprint == true &&
            c.PublicKey == nameof(ISeonConfiguration.PublicKey) &&
            c.ScriptUrl == "script url");

        Target = new SeonClientConfigProvider(seonConfiguration);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnSeonConfig()
    {
        var config = await Target_GetConfigAsync(); // Act

        var isValidSessionKey = Guid.TryParseExact(config["sessionKey"]?.ToString(), "N", out var sessionKey);
        isValidSessionKey.Should().BeTrue("Invalid session key format");

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "enabled", seonConfiguration.Enabled },
            { "enableAudioFingerprint", seonConfiguration.EnableAudioFingerprint },
            { "enableCanvasFingerprint", seonConfiguration.EnableCanvasFingerprint },
            { "enableWebGLFingerprint", seonConfiguration.EnableWebGLFingerprint },
            { "publicKey", seonConfiguration.PublicKey },
            { "scriptUrl", seonConfiguration.ScriptUrl },
            { "sessionKey", sessionKey.ToString("N") },
            { "configParams", seonConfiguration.ConfigParams },
        });
    }
}
