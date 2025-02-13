using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ConfirmPopup;

internal static class ConfirmPopupServices
{
    public static void AddConfirmPopupFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ConfirmPopupClientConfigProvider>();
    }
}
