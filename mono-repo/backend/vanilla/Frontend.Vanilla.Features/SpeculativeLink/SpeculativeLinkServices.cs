using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SpeculativeLink;

internal static class SpeculativeLinkServices
{
    public static void AddSpeculativeLinkFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISpeculativeLinkConfiguration, SpeculativeLinkConfiguration>(SpeculativeLinkConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, SpeculativeLinkClientConfigProvider>();
    }
}
