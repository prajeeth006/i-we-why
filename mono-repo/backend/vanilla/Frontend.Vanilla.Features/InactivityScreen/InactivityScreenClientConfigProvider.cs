using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.InactivityScreen;

internal sealed class InactivityScreenClientConfigProvider(IInactivityScreenConfiguration config, IVanillaClientContentService clientContentService)
    : LambdaClientConfigProvider("vnInactivityScreen", async cancellationToken =>
    {
        var resourcesTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/InactivityScreen/Resources", cancellationToken);
        var overlayTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/InactivityScreen/Overlay{(config.WebVersion > 1 ? config.WebVersion : "")}", cancellationToken);

        return new
        {
            config.Mode,
            config.ShowLogoutButton,
            config.ShowOkButton,
            config.ShowHeaderCloseButton,
            config.EnableSessionPopup,
            config.ProlongSession,
            config.WebVersion,
            idleTimeout = config.IdleTimeout.TotalMilliseconds,
            countdownTimeout = config.CountdownTimeout.TotalSeconds,
            MaxOffsetForIdleTimeout = config.MaxOffsetForIdleTimeout.TotalMilliseconds,
            resources = await resourcesTask,
            overlay = await overlayTask,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
