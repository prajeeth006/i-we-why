using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.ProductSwitchCoolOff;

internal sealed class ProductSwitchCoolOffClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider("vnProductSwitchCoolOff",
    async cancellationToken =>
    {
        var content = await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/ProductSwitchCoolOff/ProductSwitchCoolOff", cancellationToken);

        return new { content };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
