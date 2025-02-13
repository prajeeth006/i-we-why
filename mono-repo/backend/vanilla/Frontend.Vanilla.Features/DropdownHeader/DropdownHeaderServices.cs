using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DropdownHeader;

internal static class DropdownHeaderServices
{
    public static void AddDropdownHeaderFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDropdownHeaderConfiguration, DropdownHeaderConfiguration>(DropdownHeaderConfiguration
            .FeatureName);
        services.AddSingleton<IClientConfigProvider, DropdownHeaderClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, DropdownHeaderFeatureEnablementProvider>();
    }
}
