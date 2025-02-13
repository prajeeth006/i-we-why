using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IOfferDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class OfferDslProvider(IPosApiNotificationServiceInternal posApiNotificationService, ICurrentUserAccessor currentUserAccessor)
    : IOfferDslProvider
{
    public async Task<string> GetStatusAsync(ExecutionMode mode, string type, string id)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return "NOT_AUTHENTICATED";
        }

        var status = await posApiNotificationService.GetOfferStatusAsync(mode, type, id);

        return status;
    }

    public async Task<bool> IsOfferedAsync(ExecutionMode mode, string type, string id)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return false;
        }

        var status = await posApiNotificationService.GetOfferStatusAsync(mode, type, id);

        return status.EqualsIgnoreCase(OfferStatus.Offered);
    }
}
