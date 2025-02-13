using System.Collections.Generic;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.DynamicLayout;

internal class DynamicLayoutClientConfigProvider(
    IDynamicLayoutConfiguration config,
    IVanillaClientContentService clientContentService,
    ILogger<DynamicLayoutClientConfigProvider> log)
    : LambdaClientConfigProvider("vnDynamicLayout", async cancellationToken =>
    {
        var slots = new Dictionary<string, object>();

        foreach (var slot in config.Slots)
        {
            var content = new List<ClientDocument?>();

            foreach (var path in slot.Value.Path)
            {
                content.Add(await clientContentService.GetAsync(
                    $"{AppPlugin.ContentRoot}/DynamicLayout/Slots/{path}",
                    cancellationToken,
                    DslEvaluation.PartialForClient));
            }

            slots.Add(slot.Key, new
            {
                slot.Value.Type,
                IsEnabledCondition = await slot.Value.TryAsync(c => c.IsEnabledCondition.EvaluateForClientAsync(cancellationToken), log),
                content,
            });
        }

        return new
        {
            slots,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
