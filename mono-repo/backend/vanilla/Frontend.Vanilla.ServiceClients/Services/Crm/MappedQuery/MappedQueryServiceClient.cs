using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;

internal interface IMappedQueryServiceClient
{
    // ps TODO why mutable dictionary? actually it's mutated inside
    Task<MappedQueryResult> GetAsync(ExecutionMode mode, Dictionary<string, StringValues> query, bool useOnlyWmId);
}

internal class MappedQueryServiceClient(IPosApiRestClient restClient, ILogger<MappedQueryServiceClient> log) : IMappedQueryServiceClient
{
    private const string TrackerId = "trackerId";
    private const string RefererId = "refererid";
    private const string BTag = "btag";
    private const string Wm = "wm";
    private const string WmId = "wmid";
    private const string AffId = "affid";

    public async Task<MappedQueryResult> GetAsync(ExecutionMode mode, Dictionary<string, StringValues> query, bool useOnlyWmId = false)
    {
        var modified = false;

        if (query.TryGetValue(RefererId, out var referrerValue))
        {
            var tracker = await GetTrackerIdForReferrer(mode, referrerValue);

            if (tracker.HasValue)
            {
                query.Remove(RefererId);
                query[TrackerId] = tracker.ToString();
                modified = true;
            }
        }

        var hasTrackerIdParameter = query.GetValue(TrackerId).Count != 0;
        var hasBTag = query.TryGetValue(BTag, out var bTagValue);
        var hasAffId = query.TryGetValue(AffId, out var affId);
        var wmIdValue = query.GetValue(WmId).Count != 0 ? query.GetValue(WmId) : query.GetValue(Wm);
        if (!hasTrackerIdParameter && (hasBTag || hasAffId || useOnlyWmId))
        {
            var tracker = useOnlyWmId ? await GetTrackerIdForBTag(mode, string.Empty, wmIdValue, string.Empty) : await GetTrackerIdForBTag(mode, bTagValue, wmIdValue, affId);

            if (tracker.HasValue)
            {
                query.Remove(Wm);
                query.Remove(WmId);
                query[TrackerId] = tracker.ToString();
                modified = true;
            }
        }

        return new MappedQueryResult
        {
            Modified = modified,
            Query = query,
        };
    }

    private async Task<int?> GetTrackerIdForReferrer(ExecutionMode mode, StringValues referrerId)
    {
        try
        {
            // TODO: Read from PosApiEndpoint
            var url = new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.Crm)
                .AppendPathSegment("MappedTrackerId")
                .AddQueryParameters(("referrerId", referrerId))
                .GetRelativeUri();

            var dto = await restClient.ExecuteAsync<MappedTrackerIdDto>(mode, new PosApiRestRequest(url));

            return dto.TrackerId;
        }
        catch (PosApiException ex)
        {
            log.LogError(ex, "GetTrackerIdForReferrer from {referrerId} failed", referrerId);

            return null;
        }
    }

    private async Task<int?> GetTrackerIdForBTag(ExecutionMode mode, StringValues bTag, StringValues wmId, StringValues affID)
    {
        try
        {
            // TODO: Read from PosApiEndpoint
            var url = new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.Crm)
                .AppendPathSegment("WmIdForBTag")
                .AddQueryParametersIfValueNotWhiteSpace(("btag", bTag), ("wmid", wmId), ("affid", affID))
                .GetRelativeUri();

            var dto = await restClient.ExecuteAsync<MappedTrackerIdDto>(mode, new PosApiRestRequest(url));

            return dto.TrackerId > -1 ? dto.TrackerId : null;
        }
        catch (PosApiException ex)
        {
            log.LogError(ex, "GetTrackerIdForBTag from {bTag} and {wmId} failed ", bTag, wmId);

            return null;
        }
    }
}
