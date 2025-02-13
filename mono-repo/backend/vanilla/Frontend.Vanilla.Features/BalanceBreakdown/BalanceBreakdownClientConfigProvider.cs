using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.BalanceBreakdown;

internal class BalanceBreakdownClientConfigProvider(
    IMenuFactory menuFactory,
    IBalanceBreakdownConfiguration balanceBreakdownConfiguration,
    ILogger<BalanceBreakdownClientConfigProvider> log)
    : LambdaClientConfigProvider("vnBalanceBreakdown", async cancellationToken =>
    {
        var contentPath = balanceBreakdownConfiguration.UseV2 ? "/BalanceBreakdownNew/MyBalance" : "/BalanceBreakdown2/MyBalance";
        var balanceContentTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}{contentPath}", DslEvaluation.PartialForClient, cancellationToken);
        var isPaypalBalanceMessageEnabledTask =
            balanceBreakdownConfiguration.TryAsync(c => c.PaypalBalanceMessageEnabled.EvaluateForClientAsync(cancellationToken), log);
        var isPaypalReleaseFundsEnabledTask = balanceBreakdownConfiguration.TryAsync(c => c.PaypalReleaseFundsEnabled.EvaluateForClientAsync(cancellationToken), log);

        return new
        {
            v2 = balanceBreakdownConfiguration.UseV2,
            myBalanceContent = await balanceContentTask,
            isPaypalBalanceMessageEnabled = await isPaypalBalanceMessageEnabledTask,
            isPaypalReleaseFundsEnabled = await isPaypalReleaseFundsEnabledTask,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
