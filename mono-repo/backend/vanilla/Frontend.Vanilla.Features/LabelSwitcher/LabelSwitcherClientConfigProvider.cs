using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LabelSwitcher;

internal sealed class LabelSwitcherClientConfigProvider : LambdaClientConfigProvider
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    public LabelSwitcherClientConfigProvider(ILabelSwitcherConfiguration config,
        IMenuFactory menuFactory,
        IVanillaClientContentService clientContentService,
        IEnvironmentProvider environmentProvider)
        : base("vnLabelSwitcher", async cancellationToken =>
        {
            // Run in parallel
            var mainTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/LabelSwitcher/Main", DslEvaluation.FullOnServer, cancellationToken);
            var resourcesTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/LabelSwitcher/Resources", cancellationToken);
            var isRestrictedAccessConditionTask = config.IsRestrictedAccessCondition.EvaluateForClientAsync(cancellationToken);
            var showChangeLabelToasterTask = config.ShowChangeLabelToasterCondition.EvaluateForClientAsync(cancellationToken);

            var main = await mainTask;
            MapEnvironmentUrl(main?.Children, environmentProvider.Environment);
            var resources = await resourcesTask;
            var isRestrictedAccessCondition = await isRestrictedAccessConditionTask;
            var showChangeLabelToaster = await showChangeLabelToasterTask;

            return new { showChangeLabelToaster, isRestrictedAccessCondition, main, resources, config.ShowOnEveryStateSwitchWhenEnabled, config.PersistStayInState };
        }) { }

    private static void MapEnvironmentUrl(IReadOnlyList<MenuItem>? items, string environment)
    {
        if (items == null) return;

        foreach (var item in items)
        {
            var url = item.Parameters.GetValue($"url.{environment}") ?? item.Parameters.GetValue("url");
            if (url != null)
                item.Url = new Uri(url);
        }
    }
}
