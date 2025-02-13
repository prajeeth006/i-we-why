using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.BarcodeScanner;

internal static class BarcodeScannerServices
{
    public static void AddBarcodeScannerFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IBarcodeScannerIntegrationConfiguration, BarcodeScannerIntegrationConfiguration>(BarcodeScannerIntegrationConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, BarcodeScannerClientConfigProvider>();
    }
}
