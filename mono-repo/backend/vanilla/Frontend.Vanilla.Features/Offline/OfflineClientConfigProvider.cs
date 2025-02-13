using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Offline;

internal class OfflineClientConfigProvider(IOfflineConfiguration offlineConfiguration, IVanillaClientContentService clientContentService)
    : LambdaClientConfigProvider("vnOffline", async ct =>
    {
        var isOfflineEnabledTask = offlineConfiguration.IsOfflineOverlayEnabled.EvaluateForClientAsync(ct);
        var content = await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/Offline/Offline", ct);

        return new
        {
            isOverlayEnabled = await isOfflineEnabledTask,
            offlineConfiguration.OfflineRequestsThreshold,
            content,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
