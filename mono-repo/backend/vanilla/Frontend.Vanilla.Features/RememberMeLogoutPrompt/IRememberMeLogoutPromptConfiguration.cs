using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.RememberMeLogoutPrompt;

internal interface IRememberMeLogoutPromptConfiguration : IDisableableConfiguration { }

internal sealed class RememberMeLogoutPromptConfiguration : IRememberMeLogoutPromptConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.RememberMeLogoutPrompt";

    public bool IsEnabled { get; set; }
}
