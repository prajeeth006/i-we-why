namespace Frontend.Host.Features.PageNotFound;

internal interface IPageNotFoundConfiguration
{
    public IDictionary<string, IReadOnlyList<string>> ClientPaths { get; }
}

internal sealed class PageNotFoundConfiguration(IDictionary<string, IReadOnlyList<string>> clientPaths) : IPageNotFoundConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PageNotFound";

    public IDictionary<string, IReadOnlyList<string>> ClientPaths { get; } = clientPaths;
}
