using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LossLimits;

internal sealed class LossLimitsClientConfigProvider(
    ILossLimitsConfiguration lossLimitsConfiguration,
    IVanillaClientContentService clientContentService,
    IMenuFactory menuFactory)
    : LambdaClientConfigProvider("vnLossLimits", async cancellationToken =>
    {
        var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/LossLimits/LossLimits", cancellationToken);
        var updateCTA = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/LossLimits/UpdateCTA", DslEvaluation.PartialForClient, cancellationToken);

        return new
        {
            lossLimitsConfiguration.CloseWaitingTime,
            content = await contentTask,
            updateCTA = await updateCTA,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
