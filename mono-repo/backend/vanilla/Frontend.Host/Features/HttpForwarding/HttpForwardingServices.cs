using System.Net;
using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.HttpForwarding;

internal static class HttpForwardingServices
{
    public static void AddHttpForwardingFeature(this IServiceCollection services)
    {
        // http forwarding
        services.AddHttpForwarder();
        services.AddConfiguration<IHttpForwardingConfiguration, HttpForwardingConfiguration>(HttpForwardingConfiguration.FeatureName);
        services.AddSingleton<IHttpForwarderProvider, DefaultHttpForwarderProvider>();
        services.AddScoped<IHttpForwarderProvider, EngagementMicroAppsHttpForwarderProvider>();

        // product-api
        services.AddConfiguration<IProductApiConfiguration, ProductApiConfiguration>(ProductApiConfiguration.FeatureName);
        services.AddScoped<IProductApiHttpClient, ProductApiHttpClient>();
        services.AddScoped<ProductApiHeadersForwardingHandler>();
        services.AddScoped<ProductApiEagerClientConfigHeadersForwardingHandler>();

        services.AddHttpClient(ProductApiHttpClient.HttpClientName)
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { AutomaticDecompression = DecompressionMethods.All, ServerCertificateCustomValidationCallback = (_, _, _, _) => true })
            .AddHttpMessageHandler<ProductApiHeadersForwardingHandler>();

        services.AddHttpClient(ProductApiHttpClient.ClientConfigHttpClientName)
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { AutomaticDecompression = DecompressionMethods.All, ServerCertificateCustomValidationCallback = (_, _, _, _) => true })
            .AddHttpMessageHandler<ProductApiHeadersForwardingHandler>()
            .AddHttpMessageHandler<ProductApiEagerClientConfigHeadersForwardingHandler>();
    }
}
