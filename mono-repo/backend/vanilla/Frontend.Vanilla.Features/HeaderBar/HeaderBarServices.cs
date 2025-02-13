using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.HeaderBar;

internal static class HeaderBarServices
{
    public static void AddHeaderBarFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, HeaderBarClientConfigProvider>();
        services.AddConfiguration<IHeaderBarConfiguration, HeaderBarConfiguration>(HeaderBarConfiguration.FeatureName);
    }
}
