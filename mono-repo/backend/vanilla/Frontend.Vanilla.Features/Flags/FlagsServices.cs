using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Flags;

internal static class FlagsServices
{
    public static void AddFlagsFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, FlagsClientConfigProvider>();
    }
}
