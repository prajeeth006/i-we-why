using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.NavigationLayout;

internal sealed class NavigationLayoutClientConfigProvider(IMenuFactory menuFactory, IAccountMenuConfiguration accountMenuConfiguration) : LambdaClientConfigProvider(
    "vnNavigationLayout",
    async ct =>
    {
        var navigation = await menuFactory.GetItemAsync($"{AppPlugin.ObsoleteContentRoot}/Navigation", DslEvaluation.PartialForClient, ct);
        var content = await menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/NavigationLayout/Root", DslEvaluation.PartialForClient, ct);

        return new
        {
            navigation,
            elements = content?.Children.ToDictionary(o => o.Name),
            accountMenuConfiguration.Version,
            accountMenuConfiguration.LeftMenuEnabledOnCustomerHub,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
