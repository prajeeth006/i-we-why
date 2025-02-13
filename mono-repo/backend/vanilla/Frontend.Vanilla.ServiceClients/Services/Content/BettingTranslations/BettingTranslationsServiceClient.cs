using System;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;

internal interface IBettingTranslationsServiceClient
{
    Task<Translation> GetTranslationAsync(ExecutionMode mode, string type, string id);
}

internal class BettingTranslationsServiceClient(IGetDataServiceClient getDataServiceClient) : IBettingTranslationsServiceClient
{
    public Task<Translation> GetTranslationAsync(ExecutionMode mode, string type, string id)
    {
        Guard.NotWhiteSpace(type, nameof(type));

        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Content)
            .AppendPathSegment("betting")
            .AppendPathSegment(type)
            .AppendPathSegment(id)
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<Translation, Translation>(mode, PosApiDataType.Static, url, true, $"{url}#{CultureInfo.CurrentCulture}");
    }
}
