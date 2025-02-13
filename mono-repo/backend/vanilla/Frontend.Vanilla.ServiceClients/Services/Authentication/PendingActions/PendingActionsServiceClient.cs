using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;

internal interface IPendingActionsServiceClient : IFreshUserDataServiceClient<PendingActionList> { }

internal class PendingActionsServiceClient(IPosApiRestClient restClient)
    : FreshUserDataServiceClient<PendingActionList, PendingActionList>(restClient), IPendingActionsServiceClient
{
    public override PathRelativeUri DataUrl => PosApiEndpoint.Authentication.PendingActions;
}
