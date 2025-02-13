using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.ArcSessionSummary;

internal interface ISessionSummaryServiceClient
{
    [NotNull]
    Task<SessionSummaryResponse> GetAsync(ExecutionMode mode, UtcDateTime startDate, UtcDateTime endDate, string aggregationType, string timeZone, bool cached = true);
}

internal sealed class SessionSummaryServiceClient(IGetDataServiceClient getDataServiceClient) : ISessionSummaryServiceClient
{
    public Task<SessionSummaryResponse> GetAsync(
        ExecutionMode mode,
        UtcDateTime startDate,
        UtcDateTime endDate,
        string aggregationType,
        string timeZone,
        bool cached = true)
    {
        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Authentication)
            .AppendPathSegment("Arc")
            .AppendPathSegment("SessionSummary")
            .AddQueryParameters(
                ("startDate", startDate.Value.ToString("dd-MM-yyyy HH:mm:ss")),
                ("endDate", endDate.Value.ToString("dd-MM-yyyy HH:mm:ss")),
                ("aggregationType", aggregationType),
                ("timeZone", timeZone))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<SessionSummaryDto, SessionSummaryResponse>(mode, PosApiDataType.User, url);
    }
}
