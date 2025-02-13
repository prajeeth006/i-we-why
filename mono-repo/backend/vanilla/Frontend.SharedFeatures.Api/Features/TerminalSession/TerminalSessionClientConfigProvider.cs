using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.SharedFeatures.Api.Features.TerminalSession;

internal class TerminalSessionClientConfigProvider(
    ITerminalSessionConfiguration terminalSessionConfiguration,
    IVanillaClientContentService clientContentService,
    IMenuFactory menuFactory)
    : LambdaClientConfigProvider("vnTerminalSession",
        async cancellationToken =>
        {
            const string path = $"{AppPlugin.ContentRoot}/TerminalSession";

            var contentTask = clientContentService.GetAsync($"{path}/Content", cancellationToken);
            var continueSessionButtonTask = menuFactory.GetItemAsync($"{path}/ContinueSessionButton", DslEvaluation.PartialForClient, cancellationToken);
            var finishButtonTask = menuFactory.GetItemAsync($"{path}/FinishButton", DslEvaluation.PartialForClient, cancellationToken);

            return new
            {
                content = await contentTask,
                depositAlertTime = terminalSessionConfiguration.DepositAlertTimeSpan.TotalMilliseconds,
                continueSessionButton = await continueSessionButtonTask,
                finishButton = await finishButtonTask,
            };
        })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
