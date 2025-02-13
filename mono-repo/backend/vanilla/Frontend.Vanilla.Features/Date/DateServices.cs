using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Date;

internal static class DateServices
{
    public static void AddDateFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDateConfiguration, DateConfiguration>(DateConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, DateClientConfigProvider>();
    }
}
