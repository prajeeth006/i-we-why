using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.DebounceButtons;

internal interface IDebounceButtonsConfiguration : IDisableableConfiguration { }

internal sealed class DebounceButtonsConfiguration : IDebounceButtonsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DebounceButtons";

    public bool IsEnabled { get; set; }
}
