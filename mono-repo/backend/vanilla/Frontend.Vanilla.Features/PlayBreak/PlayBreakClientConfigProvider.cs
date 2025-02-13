using System.Linq;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.PlayBreak;

internal sealed class PlayBreakClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider("vnPlayBreak",
    async cancellationToken =>
    {
        var resources = await clientContentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/PlayBreak", cancellationToken);

        return new
        {
            templates = resources.ToDictionary(item => item.InternalId?.ItemName ?? string.Empty),
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
