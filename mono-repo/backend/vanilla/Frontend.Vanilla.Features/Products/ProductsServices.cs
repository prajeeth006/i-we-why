using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Products;

internal static class ProductsServices
{
    public static void AddProductsFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ProductsClientConfigProvider>();
        services.AddSingleton<IClientConfigProvider, ProductHomepagesClientConfigProvider>();
        services.AddConfiguration<IProductsConfiguration, ProductsConfiguration>(ProductsConfiguration.FeatureName);
    }
}
