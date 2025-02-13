using System.Linq;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.ValueTicket;

internal sealed class ValueTicketClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider("vnValueTicket",
    async cancellationToken =>
    {
        var overlays = await clientContentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/ValueTicket/Overlays", cancellationToken);

        return new
        {
            isEnabled = overlays.Any(),
            overlays,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
