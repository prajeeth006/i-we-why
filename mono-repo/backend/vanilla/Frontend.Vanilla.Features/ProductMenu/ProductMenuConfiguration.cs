namespace Frontend.Vanilla.Features.ProductMenu;

internal interface IProductMenuConfiguration
{
    int NumberOfApps { get; }
    bool RouterMode { get; }
    bool UseV2 { get; }
    bool HideTabsV1 { get; }
    bool AnimateV1 { get; }
    bool ShowCloseButtonAsText { get; }
    string HeaderBarCssClass { get; }
    string CloseButtonTextCssClass { get; }
}

internal class ProductMenuConfiguration(
    int numberOfApps,
    bool routerMode,
    bool useV2,
    bool hideTabsV1,
    bool animateV1,
    bool showCloseButtonAsText,
    string headerBarCssClass,
    string closeButtonTextCssClass)
    : IProductMenuConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.ProductMenu";

    public int NumberOfApps { get; set; } = numberOfApps;

    public bool RouterMode { get; set; } = routerMode;

    public bool UseV2 { get; set; } = useV2;

    public bool HideTabsV1 { get; set; } = hideTabsV1;

    public bool AnimateV1 { get; set; } = animateV1;
    public bool ShowCloseButtonAsText { get; set; } = showCloseButtonAsText;
    public string HeaderBarCssClass { get; set; } = headerBarCssClass;
    public string CloseButtonTextCssClass { get; set; } = closeButtonTextCssClass;
}
