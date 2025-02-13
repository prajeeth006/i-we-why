using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.ProductMenu;

internal class ProductMenuClientConfigProvider(
    IProductMenuConfiguration productMenuConfiguration,
    IMenuFactory menuFactory,
    IEpcotDslProvider epcotDslProvider)
    : LambdaClientConfigProvider("vnProductMenu", async cancellationToken =>
    {
        if (productMenuConfiguration.UseV2)
        {
            var menuTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/ProductMenu2/Menu", DslEvaluation.PartialForClient, cancellationToken);
            var menu = await menuTask;

            return new
            {
                menu,
                v2 = true,
                productMenuConfiguration.NumberOfApps,
                productMenuConfiguration.RouterMode,
                productMenuConfiguration.ShowCloseButtonAsText,
                productMenuConfiguration.HeaderBarCssClass,
            };
        }

        var tabsTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/ProductMenu/Tabs", DslEvaluation.PartialForClient, cancellationToken);
        var headerTask = epcotDslProvider.IsEnabled("header")
            ? menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/ProductMenu/Header", DslEvaluation.PartialForClient, cancellationToken)
            : DefaultResultTask<MenuItem?>.Value;
        var apps = await menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/ProductMenu/Apps", DslEvaluation.PartialForClient, cancellationToken);
        var tabs = await tabsTask;
        var header = await headerTask;

        return new
        {
            tabs,
            apps,
            header,
            productMenuConfiguration.NumberOfApps,
            productMenuConfiguration.RouterMode,
            productMenuConfiguration.AnimateV1,
            productMenuConfiguration.HideTabsV1,
            productMenuConfiguration.ShowCloseButtonAsText,
            productMenuConfiguration.HeaderBarCssClass,
            productMenuConfiguration.CloseButtonTextCssClass,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
