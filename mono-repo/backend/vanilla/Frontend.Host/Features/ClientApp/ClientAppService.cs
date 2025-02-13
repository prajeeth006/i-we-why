using ErrorOr;
using Frontend.Host.Features.Assets;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.ClientApp;

internal interface IClientAppService
{
    Task<ErrorOr<HttpResponseMessage>> GetAsync(string subpath, CancellationToken cancellationToken);
    Task<Version> GetCurrentVersionAsync(CancellationToken cancellationToken);
    Task<IList<Version>> GetAvailableVersionsAsync(CancellationToken cancellationToken);
    ClientAppMode Mode { get; }
}

internal sealed class ClientAppService(
    VanillaVersion vanillaVersion,
    IDynaConParameterExtractor dynaConParameterExtractor,
    ILabelIsolatedDistributedCache labelIsolatedDistributedCache,
    ClientAppHttpClient clientAppHttpClient,
    IClientAppConfiguration config,
    VanillaVersion version,
    IWebpackDevServerConfiguration webpackDevServerConfiguration,
    ILogger<IClientAppService> log)
    : IClientAppService
{
    public const string CacheKey = "c-app-version";

    private readonly IDistributedCache cache = labelIsolatedDistributedCache.IsolateBy(_ => dynaConParameterExtractor.Product)
        .IsolateBy(_ => vanillaVersion.ToString());

    public ClientAppMode Mode => config.Mode;

    private Uri? devServerBaseUrl;

    private Uri DevServerBaseAddress
    {
        get
        {
            return devServerBaseUrl ??= string.IsNullOrEmpty(webpackDevServerConfiguration.Url)
                ? throw new Exception(
                    "When the ClientApp mode is set to 'DevServer,' you need to configure the WebpackDevServer in the appsettings.json file.")
                : new Uri(new Uri(webpackDevServerConfiguration.Url), "ClientDist/");
        }
    }

    public async Task<ErrorOr<HttpResponseMessage>> GetAsync(string subpath, CancellationToken cancellationToken)
    {
        try
        {
            var url = Mode == ClientAppMode.DevServer
                ? new Uri(DevServerBaseAddress, subpath)
                : new Uri(
                    $"{config.FileServerHost}/{await GetCurrentVersionAsync(cancellationToken)}/{subpath.Substring(12)}"); // .Substring(12) strips /clientdist/
            var response = await clientAppHttpClient.GetAsync(url, cancellationToken);

            return response;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "ClientAppService.GetAsync failed.");
            return Error.Failure(code: "Fetch failed.", ex.Message);
        }
    }

    public async Task<Version> GetCurrentVersionAsync(CancellationToken cancellationToken)
    {
        if (config.ForceSpecificVersion is null)
        {
            return await GetVersionAsync(cancellationToken);
        }

        return config.ForceSpecificVersion;
    }

    public async Task<IList<Version>> GetAvailableVersionsAsync(CancellationToken cancellationToken)
    {
        var versions = await clientAppHttpClient.GetFromJsonAsync<IList<Version>>(new UriBuilder(config.FileServerHost).AppendPathSegment("versions.json").Uri,
            cancellationToken);

        return versions!;
    }

    private async Task<Version> GetVersionAsync(CancellationToken cancellationToken)
    {
        var cachedVersion = await cache.GetStringAsync(CacheKey, cancellationToken);

        if (cachedVersion is not null && Version.TryParse(cachedVersion, out var v)) return v;

        var availableVersions = await GetAvailableVersionsAsync(cancellationToken);
        var latestVersion = FindLatestVersion(availableVersions);

        await cache.SetStringAsync(
            CacheKey,
            latestVersion.ToString(),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = config.FileServerVersionCacheTime },
            cancellationToken);

        return latestVersion;
    }

    private Version FindLatestVersion(IList<Version> versions)
    {
        if (config.FileServerRollForwardStrategy == FileServerRollForwardStrategy.LatestPatch)
        {
            var latestPatch = versions.Where(v =>
                    v.Major == version.Version.Major
                    && v.Minor == version.Version.Minor)
                .MaxBy(v => v.Build);

            if (latestPatch is null)
                throw new ClientAppNoSuitableVersionException(
                    $"Failed to retrieve version using strategy {FileServerRollForwardStrategy.LatestPatch} and version {version.Version} in {string.Join(',', versions)}");

            var latestRevision = versions.Where(v =>
                    v.Major == latestPatch.Major
                    && v.Minor == latestPatch.Minor
                    && v.Build == latestPatch.Build)
                .MaxBy(v => v.Revision);

            return latestRevision ?? throw new ClientAppNoSuitableVersionException(
                $"Failed to retrieve version using strategy {FileServerRollForwardStrategy.LatestPatch} and version {version.Version} in {string.Join(',', versions)}");
        }

        if (config.FileServerRollForwardStrategy == FileServerRollForwardStrategy.LatestMinor)
        {
            var highestMinor = versions.Where(v =>
                    v.Major == version.Version.Major)
                .MaxBy(v => v.Minor) ?? throw new ClientAppNoSuitableVersionException(
                $"Failed to retrieve version using strategy {FileServerRollForwardStrategy.LatestMinor} and version {version.Version} in {string.Join(',', versions)}");

            var highestPatch = versions.Where(v =>
                    v.Major == highestMinor.Major
                    && v.Minor == highestMinor.Minor)
                .MaxBy(v => v.Build);

            if (highestPatch is null)
                throw new ClientAppNoSuitableVersionException(
                    $"Failed to retrieve version using strategy {FileServerRollForwardStrategy.LatestMinor} and version {version.Version} in {string.Join(',', versions)}");

            var highestRevision = versions.Where(v =>
                    v.Major == highestPatch.Major
                    && v.Minor == highestPatch.Minor
                    && v.Build == highestPatch.Build)
                .MaxBy(v => v.Revision);

            return highestRevision!;
        }

        if (versions.Contains(version.Version))
        {
            return version.Version;
        }

        throw new ClientAppNoSuitableVersionException($"Version {version.Version} is not found in {string.Join(',', versions)}");
    }
}
