#nullable enable

using System;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;

internal interface IApplicationInformationServiceClient
{
    Task<ApplicationInformation> GetAsync(ExecutionMode mode, string platform, string appId, string? country);
}

internal class ApplicationInformationServiceClient(IGetDataServiceClient getDataServiceClient) : IApplicationInformationServiceClient
{
    public Task<ApplicationInformation> GetAsync(ExecutionMode mode, string platform, string appId, string? country)
    {
        Guard.NotWhiteSpace(platform, nameof(platform));
        Guard.NotWhiteSpace(appId, nameof(appId));

        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("NativeApps")
            .AppendPathSegment(platform)
            .AppendPathSegment(appId)
            .AddQueryParametersIfValueNotWhiteSpace(
                ("country", country),
                ("lang", CultureInfo.CurrentCulture.TwoLetterISOLanguageName))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<ApplicationInformation, ApplicationInformation>(mode, PosApiDataType.Static, url);
    }
}
