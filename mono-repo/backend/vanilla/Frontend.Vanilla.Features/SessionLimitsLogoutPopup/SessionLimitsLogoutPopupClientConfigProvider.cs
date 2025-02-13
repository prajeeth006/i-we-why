using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.SessionLimitsLogoutPopup;

internal sealed class SessionLimitsLogoutPopupClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider(
    "vnSessionLimitsLogoutPopup", async cancellationToken =>
    {
        var content = await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/SessionLimitsLogoutPopup/Content", cancellationToken);

        return new
        {
            content,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
