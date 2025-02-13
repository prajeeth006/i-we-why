using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ProductSwitchCoolOff;

internal static class ProductSwitchCoolOffServices
{
    public static void AddProductSwitchCoolOffFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IProductSwitchCoolOffConfiguration, ProductSwitchCoolOffConfiguration>(ProductSwitchCoolOffConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, ProductSwitchCoolOffClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, ProductSwitchCoolOffFeatureEnablementProvider>();
    }
}
