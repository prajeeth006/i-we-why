using System;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.FraudProtection;

internal sealed class SeonClientConfigProvider(ISeonConfiguration config) : LambdaClientConfigProvider("vnSeon",
    () => new
    {
        config.Enabled,
        config.EnableAudioFingerprint,
        config.EnableCanvasFingerprint,
        config.EnableWebGLFingerprint,
        config.PublicKey,
        config.ScriptUrl,
        sessionKey = Guid.NewGuid().ToString("N"),
        config.ConfigParams,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
