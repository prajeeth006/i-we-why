using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Products;

internal sealed class ProductsClientConfigProvider(IProductsConfiguration productsConfiguration)
    : LambdaClientConfigProvider("vnProducts", () => productsConfiguration.Products) { }
