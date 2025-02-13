using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.BestationHardwareFault;

internal static class BestationHardwareFaultServices
{
    public static void AddBestationHardwareFaultFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, BestationHardwareFaultClientConfigProvider>();
    }
}
