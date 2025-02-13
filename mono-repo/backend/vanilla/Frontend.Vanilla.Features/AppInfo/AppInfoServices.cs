using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.AppInfo;

internal static class AppInfoServices
{
    public static void AddAppInfoFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, AppInfoClientConfigProvider>();
    }
}
