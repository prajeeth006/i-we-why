using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ProductMenu;

internal static class ProductMenuServices
{
    public static void AddProductMenuFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IProductMenuConfiguration, ProductMenuConfiguration>(ProductMenuConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, ProductMenuClientConfigProvider>();
    }
}
