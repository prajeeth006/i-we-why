using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.BottomSheet;

internal static class BottomSheetServices
{
    public static void AddBottomSheetFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, BottomSheetContentClientConfigProvider>();
    }
}
