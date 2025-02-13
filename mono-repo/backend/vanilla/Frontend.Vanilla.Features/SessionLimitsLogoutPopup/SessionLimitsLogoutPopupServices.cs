using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SessionLimitsLogoutPopup;

internal static class SessionLimitsLogoutPopupServices
{
    public static void AddSessionLimitsLogoutPopupFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, SessionLimitsLogoutPopupClientConfigProvider>();
    }
}
