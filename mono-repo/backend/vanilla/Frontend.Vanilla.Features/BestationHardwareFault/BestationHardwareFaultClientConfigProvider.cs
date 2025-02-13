using System.Linq;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.BestationHardwareFault;

internal class BestationHardwareFaultClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider("vnBestationHardwareFault",
    async cancellationToken =>
    {
        var overlays =
            await clientContentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/BetstationHardwareFault/Overlays",
                cancellationToken);

        return new
        {
            isEnabled = overlays.Any(),
            overlays,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
