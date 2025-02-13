using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.ActivityPopup;

internal class ActivityPopupClientConfigProvider(IActivityPopupConfiguration config, IVanillaClientContentService clientContentService)
    : LambdaClientConfigProvider("vnActivityPopup", async cancellationToken =>
    {
        var resourcesTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/ActivityPopup/Resources",
            cancellationToken);

        return new
        {
            timeout = config.Timeout.TotalMilliseconds,
            resources = await resourcesTask,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
