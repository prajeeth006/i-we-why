using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.ClientApp;
using Frontend.Host.Features.Index;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Theming;

namespace Frontend.Host.Features.Assets;

/// <summary>
/// A set of helper functions for resolving which assets to use.
/// </summary>
public interface IBootstrapAssetsContext
{
    /// <summary>
    /// Gets the currently active theme.
    /// </summary>
    string Theme { get; }

    /// <summary>
    /// Sets the name of the webpack manifest file to use. Default is <c>~/ClientDist/manifest.json</c>.
    /// </summary>
    void SetManifestFile(string filePath);

    /// <summary>
    /// Sets the path for the locales folder. Default is <c>~/ClientDist/locales</c>.
    /// Should be the outputpath configured in project.json plus the output folder configured for locales assets.
    /// </summary>
    void SetLocalesPath(string localesFolderPath);

    /// <summary>
    /// Resolves a file path built by webpack by using either using a <c>WebpackDevServer</c> url from appSettings (locally) or using the webpack manifest (on server).
    /// </summary>
    Task<string> WebpackFileAsync(string fileName, CancellationToken cancellationToken);

    /// <summary>
    /// Resolves content of a file built by webpack.
    /// </summary>
    Task<string> WebpackFileContentAsync(string fileName, CancellationToken cancellationToken);

    /// <summary>
    /// Resolves entries of manifest.json file.
    /// </summary>
    Task<IReadOnlyDictionary<string, string>> GetWebpackManifestFileEntriesAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Resolves the current locale file path (returns null for <c>en</c> since it is included in Angular).
    /// </summary>
    string? LocaleFile(string? suffix = null);

    ClientAppMode Mode { get; }
    IndexHtmlMode IndexHtmlMode { get; }

    Task<IEnumerable<ModulePreloadBootstrapAsset>> GetModulePreloadLinksAsync(CancellationToken cancellationToken);
}

internal class BootstrapAssetsContext(
    IWebpackManifestFileResolver webpackManifestFileResolver,
    ILanguageService languageService,
    IThemeResolver themeResolver,
    IClientAppService clientAppService,
    IIndexHtmlConfiguration indexHtmlConfiguration)
    : IBootstrapAssetsContext
{
    private string manifestFilePath = $"ClientDist/{ManifestJsonFileName}";
    private const string ManifestJsonFileName = "manifest.json";
    private string localesPath = $"ClientDist/locales";

    public string Theme => themeResolver.GetTheme();

    public ClientAppMode Mode => clientAppService.Mode;
    public IndexHtmlMode IndexHtmlMode => indexHtmlConfiguration.Mode;

    public async Task<IEnumerable<ModulePreloadBootstrapAsset>> GetModulePreloadLinksAsync(CancellationToken cancellationToken)
    {
        if (indexHtmlConfiguration.Mode == IndexHtmlMode.AngularCliGeneratedIndexHtml)
        {
            return [];
        }

        (await GetWebpackManifestFileEntriesAsync(cancellationToken)).TryGetValue("module-preload-links", out var modulePreloadLinksValue);
        return modulePreloadLinksValue?.Split(",").Select(link => new ModulePreloadBootstrapAsset(link)) ?? [];
    }

    public void SetManifestFile(string filePath)
    {
        Guard.NotWhiteSpace(filePath, nameof(filePath));

        manifestFilePath = filePath;
    }

    public void SetLocalesPath(string localesFolderPath)
    {
        Guard.NotWhiteSpace(localesFolderPath, nameof(localesFolderPath));

        localesPath = localesFolderPath;
    }

    public Task<string> WebpackFileAsync(string fileName, CancellationToken cancellationToken)
    {
        Guard.NotWhiteSpace(fileName, nameof(fileName));

        return webpackManifestFileResolver.GetFileNameAsync(manifestFilePath, fileName, cancellationToken);
    }

    public Task<string> WebpackFileContentAsync(string fileName, CancellationToken cancellationToken)
    {
        Guard.NotWhiteSpace(fileName, nameof(fileName));

        return webpackManifestFileResolver.GetFileContentAsync(manifestFilePath, fileName, cancellationToken);
    }

    public Task<IReadOnlyDictionary<string, string>> GetWebpackManifestFileEntriesAsync(CancellationToken cancellationToken) =>
        webpackManifestFileResolver.GetFileAsync(manifestFilePath, cancellationToken);

    public string? LocaleFile(string? suffix = null)
    {
        var lang = languageService.Current.AngularLocale;

        return lang != "en" ? $"{localesPath}/{lang}{suffix}.js" : null;
    }
}
