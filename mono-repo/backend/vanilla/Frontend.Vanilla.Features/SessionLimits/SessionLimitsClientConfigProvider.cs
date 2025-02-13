using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.SessionLimits;

internal sealed class SessionLimitsClientConfigProvider(
    ISessionLimitsConfiguration sessionLimitsConfiguration,
    IVanillaClientContentService clientContentService,
    IMenuFactory menuFactory)
    : LambdaClientConfigProvider("vnSessionLimits", async cancellationToken =>
    {
        var version = sessionLimitsConfiguration.Version == 1 ? string.Empty : sessionLimitsConfiguration.Version.ToString();
        var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/SessionLimits/SessionLimits{version}", cancellationToken);
        var updateCtaTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/SessionLimits/UpdateCTA{version}", DslEvaluation.PartialForClient, cancellationToken);

        return new
        {
            content = await contentTask,
            updateCTA = await updateCtaTask,
            sessionLimitsConfiguration.SkipOverlay,
            sessionLimitsConfiguration.IsAutoLogoutEnabled,
            sessionLimitsConfiguration.CloseWaitingTime,
            sessionLimitsConfiguration.Version,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
