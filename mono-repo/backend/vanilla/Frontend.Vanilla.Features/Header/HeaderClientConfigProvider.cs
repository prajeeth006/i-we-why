using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Header;

internal sealed class HeaderClientConfigProvider(
    IHeaderConfiguration headerConfiguration,
    IMenuFactory menuFactory) : LambdaClientConfigProvider("vnHeader", async cancellationToken =>
{
    var isEnabledConditionTask = headerConfiguration.Enabled.EvaluateForClientAsync(cancellationToken);
    var authItemsTask = menuFactory.GetSectionAsync($"{HeaderContentPath}/Elements/AuthItems", DslEvaluation.PartialForClient, cancellationToken);
    var unauthItemsTask = menuFactory.GetSectionAsync($"{HeaderContentPath}/Elements/UnauthItems", DslEvaluation.PartialForClient, cancellationToken);
    var leftItemsTask = menuFactory.GetSectionAsync($"{HeaderContentPath}/Elements/LeftItems", DslEvaluation.PartialForClient, cancellationToken);
    var topSlotItemsTask = menuFactory.GetSectionAsync($"{HeaderContentPath}/Elements/TopSlotItems", DslEvaluation.PartialForClient, cancellationToken);
    var pillItemsTask = menuFactory.GetSectionAsync($"{HeaderContentPath}/Elements/PillItems", DslEvaluation.PartialForClient, cancellationToken);
    var productItemsTask = headerConfiguration.Version == 2
        ? menuFactory.GetSectionAsync($"{HeaderContentPath}/Elements/ProductItems", DslEvaluation.PartialForClient, cancellationToken)
        : DefaultResultTask<MenuSection?>.Value;
    var productsTask = menuFactory.GetSectionAsync($"{HeaderContentPath}/Products", DslEvaluation.PartialForClient, cancellationToken);

    var isEnabledCondition = await isEnabledConditionTask;
    var elements = new
    {
        leftItems = (await leftItemsTask)?.Items,
        unauthItems = (await unauthItemsTask)?.Items,
        authItems = (await authItemsTask)?.Items,
        topSlotItems = (await topSlotItemsTask)?.Items,
        pillItems = (await pillItemsTask)?.Items,
        productItems = (await productItemsTask)?.Items,
    };
    var products = ((await productsTask)?.Items?.ToList()).NullToEmpty();

    var disabledItems = new
    {
        disabled = await headerConfiguration.DisabledItems.Disabled.EvaluateForClientAsync(cancellationToken),
        sections = headerConfiguration.DisabledItems.Sections,
    };

    return new
    {
        isEnabledCondition,
        disabledItems,
        elements,
        products,
        headerConfiguration.Version,
        headerConfiguration.OnboardingEnabled,
        headerConfiguration.HotspotLoginCount,
        headerConfiguration.PulseEffectLoginCount,
        headerConfiguration.EnableToggleOnScroll,
    };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    private const string HeaderContentPath = AppPlugin.ContentRoot + "/Header";

    // Run in parallel
}
