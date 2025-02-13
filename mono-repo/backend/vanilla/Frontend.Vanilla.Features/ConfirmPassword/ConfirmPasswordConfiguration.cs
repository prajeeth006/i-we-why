using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.ConfirmPassword;

internal interface IConfirmPasswordConfiguration : IDisableableConfiguration
{
    string RedirectUrl { get; }
}

internal sealed class ConfirmPasswordConfiguration : IConfirmPasswordConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ConfirmPassword";
    public bool IsEnabled { get; set; }
    public string RedirectUrl { get; set; } = "";
}
