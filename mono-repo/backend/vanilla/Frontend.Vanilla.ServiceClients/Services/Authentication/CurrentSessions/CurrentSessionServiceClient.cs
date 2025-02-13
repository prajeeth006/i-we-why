using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;

internal interface ICurrentSessionServiceClient : IFreshUserDataServiceClient<CurrentSession> { }

internal class CurrentSessionServiceClient(IPosApiRestClient restClient)
    : FreshUserDataServiceClient<CurrentSessionDto, CurrentSession>(restClient), ICurrentSessionServiceClient
{
    public override PathRelativeUri DataUrl => PosApiEndpoint.Authentication.CurrentSession;
}
