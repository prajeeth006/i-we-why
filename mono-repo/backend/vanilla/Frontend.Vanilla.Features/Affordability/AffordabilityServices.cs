using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Affordability;

internal static class AffordabilityServices
{
    public static void AddAffordabilityFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IAffordabilityConfiguration, AffordabilityConfiguration>(AffordabilityConfiguration.FeatureName);
    }
}
