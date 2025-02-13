#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Languages;

internal interface ILanguagesServiceClient
{
    Task<IReadOnlyList<Language>> GetCachedAsync(ExecutionMode mode);
    Task<IReadOnlyList<Language>> GetFreshAsync(ExecutionMode mode); // Used by HealthCheck
}

internal sealed class LanguagesServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache) : ILanguagesServiceClient
{
    private static string CurrentCacheKey => "Languages:" + CultureInfo.CurrentCulture;
    private const PosApiDataType DataType = PosApiDataType.Static;

    public Task<IReadOnlyList<Language>> GetCachedAsync(ExecutionMode mode)
        => cache.GetOrCreateAsync(mode, DataType, CurrentCacheKey, () => ExecuteFreshAsync(mode));

    public async Task<IReadOnlyList<Language>> GetFreshAsync(ExecutionMode mode)
    {
        // Even if fresh is requested, store successful result to the cache
        var languages = await ExecuteFreshAsync(mode);
        cache.Set(DataType, CurrentCacheKey, languages);

        return languages;
    }

    private async Task<IReadOnlyList<Language>> ExecuteFreshAsync(ExecutionMode mode)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("Language")
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParameters(("lang", CultureInfo.CurrentCulture.Name))
            .GetRelativeUri();

        var dto = await restClient.ExecuteAsync<LanguagesResponse>(mode, new PosApiRestRequest(url));

        return dto.Languages.AsReadOnly();
    }
}
