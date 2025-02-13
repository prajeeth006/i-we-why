namespace Frontend.Vanilla.Features.AdobeTarget;

internal interface IAdobeTargetConfiguration
{
    string Token { get; }
}

internal sealed class AdobeTargetConfiguration : IAdobeTargetConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.AdobeTarget";

    public string Token { get; set; } = "";
}
