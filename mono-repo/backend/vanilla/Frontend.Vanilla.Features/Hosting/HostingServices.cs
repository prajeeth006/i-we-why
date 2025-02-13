using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Hosting;

internal static class HostingServices
{
    public static void AddHostingFeature(this IServiceCollection services)
    {
        services.AddSingleton<IDataCenterResolver, DataCenterResolver>();
        services.AddSingleton<IHostingPlatformResolver, HostingPlatformResolver>();
        services.AddSingleton(p => new DynaConParameter($"{DynaConParameter.ContextPrefix}HostingPlatform", p.GetRequiredService<IHostingPlatformResolver>().Current.ToString()));
    }
}
