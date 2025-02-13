using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.BottomNav;

internal class BottomNavClientConfigProvider(IBottomNavConfiguration bottomNavConfiguration, IMenuFactory menuFactory, ILogger<BottomNavClientConfigProvider> log)
    : LambdaClientConfigProvider("vnBottomNav", async cancellationToken =>
    {
        var isEnabledTask =
            bottomNavConfiguration.TryAsync(c => c.IsEnabled.EvaluateForClientAsync(cancellationToken), log);
        var sectionTask = menuFactory.GetSectionAsync($"{AppPlugin.ContentRoot}/BottomNav/Items", DslEvaluation.PartialForClient, cancellationToken);

        return new
        {
            isEnabledCondition = await isEnabledTask,
            (await sectionTask)?.Items,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
