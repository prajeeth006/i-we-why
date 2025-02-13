namespace Frontend.Host.Features.App;

internal enum SamePathAppVersion
{
    SportsWebApp = 1,
    SportsBetstationApp = 2,
    CoralDesktopApp = 3,
    CoralMobileApp = 4,
    LadbrokesDesktopApp = 5,
    LadbrokesMobileApp = 6,
    BingoApp = 7,
    MokaBingoApp = 8,
}

internal interface IAppConfiguration
{
    IReadOnlyList<string> DefaultAllowedPaths { get; }
    IReadOnlyList<string> AllowedPaths { get; }
    IDictionary<string, SamePathAppVersion> SamePathAppVersions { get; }
}

internal sealed class AppConfiguration(IReadOnlyList<string> defaultAllowedPaths, IReadOnlyList<string> allowedPaths, IDictionary<string, SamePathAppVersion> samePathAppVersions) : IAppConfiguration
{
    public const string FeatureName = "Host.Features.App";

    public IReadOnlyList<string> DefaultAllowedPaths { get; set; } = defaultAllowedPaths;
    public IReadOnlyList<string> AllowedPaths { get; set; } = allowedPaths;
    public IDictionary<string, SamePathAppVersion> SamePathAppVersions { get; set; } = samePathAppVersions;
}
