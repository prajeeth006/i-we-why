namespace Frontend.Vanilla.Features.Badge;

internal interface IBadgeConfiguration
{
    string CssClass { get; }
}

internal sealed class BadgeConfiguration : IBadgeConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.Badge";

    public string CssClass { get; set; } = string.Empty;
}
