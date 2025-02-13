using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.ConfirmPopup;

internal sealed class ConfirmPopupClientConfigProvider(IVanillaClientContentService clientContentService)
    : LambdaClientConfigProvider("vnConfirmPopup", async cancellationToken => new
    {
        resources = await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/ConfirmPopup/Resources",
            cancellationToken),
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
