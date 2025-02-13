using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.ArcSessionSummary;

internal sealed class SessionSummaryDto : IPosApiResponse<SessionSummaryResponse>
{
    public string AggregationType { get; set; }
    public SessionSummary SessionSummary { get; set; }

    public SessionSummaryResponse GetData() => new SessionSummaryResponse(AggregationType, SessionSummary);
}
