using System.Collections.Generic;

namespace Frontend.Vanilla.Features.AccountUpgrade;

internal interface IAccountUpgradeConfiguration
{
    IReadOnlyList<string> AllowedUrls { get; }
    string RedirectUrl { get; }
}

internal sealed class AccountUpgradeConfiguration(IReadOnlyList<string> allowedUrls, string redirectUrl) : IAccountUpgradeConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.AccountUpgrade";

    public IReadOnlyList<string> AllowedUrls { get; set; } = allowedUrls;
    public string RedirectUrl { get; set; } = redirectUrl;
}
