using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.LastSessionInfo;

internal interface ILastSessionInfoConfiguration : IDisableableConfiguration { }

internal sealed class LastSessionInfoConfiguration : ILastSessionInfoConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LastSessionInfo";
    public bool IsEnabled { get; set; }
}
