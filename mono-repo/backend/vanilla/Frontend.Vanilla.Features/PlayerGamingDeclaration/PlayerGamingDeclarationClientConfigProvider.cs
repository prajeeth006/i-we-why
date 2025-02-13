using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.PlayerGamingDeclaration;

internal class PlayerGamingDeclarationClientConfigProvider(
    IPlayerGamingDeclarationConfiguration playerGamingDeclarationConfiguration,
    IVanillaClientContentService clientContentService,
    ILogger<PlayerGamingDeclarationClientConfigProvider> log)
    : LambdaClientConfigProvider("vnPlayerGamingDeclaration", async cancellationToken =>
    {
        var isEnabledConditionTask =
            playerGamingDeclarationConfiguration.TryAsync(c => c.IsEnabledCondition.EvaluateForClientAsync(cancellationToken), log);

        var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/GamingDeclaration/GamingDeclaration",
            cancellationToken,
            new ContentLoadOptions { DslEvaluation = DslEvaluation.PartialForClient });

        return new
        {
            isEnabledCondition = await isEnabledConditionTask,
            content = await contentTask,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
