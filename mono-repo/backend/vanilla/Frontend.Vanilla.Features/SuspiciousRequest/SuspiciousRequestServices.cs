using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SuspiciousRequest;

internal static class SuspiciousRequestServices
{
    public static void AddSuspiciousRequestFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISuspiciousRequestConfiguration, SuspiciousRequestConfiguration>(SuspiciousRequestConfiguration.FeatureName);
    }
}
