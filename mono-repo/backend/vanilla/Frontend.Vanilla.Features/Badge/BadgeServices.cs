using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Badge;

internal static class BadgeServices
{
    public static void AddBadgeFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IBadgeConfiguration, BadgeConfiguration>(BadgeConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, BadgeClientConfigProvider>();
    }
}
