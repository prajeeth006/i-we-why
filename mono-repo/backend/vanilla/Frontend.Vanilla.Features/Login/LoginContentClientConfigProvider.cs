using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Login;

internal sealed class LoginContentClientConfigProvider(IVanillaClientContentService clientContentService, IMenuFactory menuFactory) : LambdaClientConfigProvider(
    "vnLoginContent",
    async ct =>
    {
        var loginPageTask = clientContentService.GetAsync(AppPlugin.ObsoleteContentRoot + "/Login/Login", ct, DslEvaluation.PartialForClient);
        var loginMessagesTask = clientContentService.GetChildrenAsync(AppPlugin.ObsoleteContentRoot + "/Login/LoginMessages", ct, DslEvaluation.PartialForClient);
        var loginPageMessagesTask =
            clientContentService.GetChildrenAsync(AppPlugin.ObsoleteContentRoot + "/Login/LoginPageMessages", ct, DslEvaluation.PartialForClient);
        var loginPageLinksTask =
            clientContentService.GetChildrenAsync(AppPlugin.ObsoleteContentRoot + "/Login/LoginPageLinks", ct, DslEvaluation.PartialForClient);
        var loginPageMessagesBottomTask =
            clientContentService.GetChildrenAsync(AppPlugin.ObsoleteContentRoot + "/Login/LoginPageMessagesBottom", ct, DslEvaluation.PartialForClient);

        var loginPageBottomLinksTask =
            menuFactory.GetItemAsync(AppPlugin.ObsoleteContentRoot + "/Login/BottomLinks/BottomItems", DslEvaluation.PartialForClient, ct);

        var newVisitorBackgroundTask =
            clientContentService.GetAsync(AppPlugin.ObsoleteContentRoot + "/Login/NewUserPage/Background", ct, DslEvaluation.PartialForClient);
        var newVisitorCTAsTask = menuFactory.GetItemAsync(AppPlugin.ObsoleteContentRoot + "/Login/NewUserPage/CTAs", DslEvaluation.PartialForClient, ct);
        var newVisitorBottomItemsTask =
            menuFactory.GetItemAsync(AppPlugin.ObsoleteContentRoot + "/Login/NewUserPage/BottomItems", DslEvaluation.PartialForClient, ct);
        var leftItemsTask = menuFactory.GetSectionAsync($"{AppPlugin.ObsoleteContentRoot}/Login/Header/Elements/LeftItems", DslEvaluation.PartialForClient, ct);
        var registerPageLinksTask =
            clientContentService.GetChildrenAsync(AppPlugin.ObsoleteContentRoot + "/Login/RegisterPageLinks", ct, DslEvaluation.PartialForClient);
        var newVisitorTopItemsTask = menuFactory.GetItemAsync(AppPlugin.ObsoleteContentRoot + "/Login/NewUserPage/TopItems", DslEvaluation.PartialForClient, ct);
        var loginPage = await loginPageTask;
        var loginMessages = await loginMessagesTask;
        var loginPageMessages = await loginPageMessagesTask;
        var loginPageLinks = await loginPageLinksTask;
        var loginPageMessagesBottom = await loginPageMessagesBottomTask;
        var loginPageBottomLinks = await loginPageBottomLinksTask;
        var newVisitorCTAs = await newVisitorCTAsTask;
        var newVisitorBottomItems = await newVisitorBottomItemsTask;
        var newVisitorBackground = await newVisitorBackgroundTask;
        var leftItems = await leftItemsTask;
        var registerPageLinks = await registerPageLinksTask;
        var newVisitorTopItems = await newVisitorTopItemsTask;

        return new
        {
            loginPage,
            loginMessages,
            loginPageMessages,
            loginPageLinks,
            loginPageMessagesBottom,
            loginPageBottomLinks,
            leftItems,
            registerPageLinks,
            newVisitor = new
            {
                ctas = newVisitorCTAs,
                bottomItems = newVisitorBottomItems,
                background = newVisitorBackground,
                topItems = newVisitorTopItems,
            },
            elements = new
            {
                leftItems = leftItems?.Items,
            },
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
