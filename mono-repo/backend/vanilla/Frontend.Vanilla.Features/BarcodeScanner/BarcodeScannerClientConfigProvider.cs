using System.Linq;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.BarcodeScanner;

internal class BarcodeScannerClientConfigProvider(
    IBarcodeScannerIntegrationConfiguration barcodeScannerConfiguration,
    IVanillaClientContentService clientContentService)
    : LambdaClientConfigProvider("vnBarcodeScanner", async cancellationToken =>
    {
        var overlays =
            await clientContentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/BarcodeScanner/Overlays",
                cancellationToken);

        return new
        {
            ConditionalEvents = barcodeScannerConfiguration.ConditionalEvents.NullToEmpty().ToList(),
            overlays,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
