using System.Collections.Generic;

namespace Frontend.Vanilla.Features.FraudProtection;

internal interface ISeonConfiguration
{
    bool Enabled { get; }
    bool EnableAudioFingerprint { get; }
    bool EnableCanvasFingerprint { get; }
    bool EnableWebGLFingerprint { get; }
    string PublicKey { get; }
    string ScriptUrl { get; }
    IReadOnlyDictionary<string, object> ConfigParams { get; }
}

internal sealed class SeonConfiguration : ISeonConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Seon";
    public bool Enabled { get; set; }
    public bool EnableAudioFingerprint { get; set; }
    public bool EnableCanvasFingerprint { get; set; }
    public bool EnableWebGLFingerprint { get; set; }
    public string PublicKey { get; set; } = "";
    public string ScriptUrl { get; set; } = "";
    public required IReadOnlyDictionary<string, object> ConfigParams { get; set; }
}