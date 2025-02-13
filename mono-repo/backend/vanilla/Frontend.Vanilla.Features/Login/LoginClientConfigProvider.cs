using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Login;

internal sealed class LoginClientConfigProvider(IVanillaClientContentService clientContentService, IMenuFactory menuFactory, ILoginConfiguration config)
    : LambdaClientConfigProvider("vnLogin", async cancellationToken =>
    {
        var path = config.Version.HasValue
            ? $"{AppPlugin.ContentRoot}/Login/{config.Version}"
            : $"{AppPlugin.ContentRoot}/Login";

        var newVisitorTask = menuFactory.GetItemAsync($"{path}/NewVisitor", DslEvaluation.PartialForClient, cancellationToken);
        var loginMessagesTask = menuFactory.GetItemAsync($"{path}/Messages", DslEvaluation.PartialForClient, cancellationToken);
        var connectCardTask = menuFactory.GetItemAsync($"{path}/ConnectCard", DslEvaluation.PartialForClient, cancellationToken);
        var betstationSectionTask = menuFactory.GetItemAsync($"{path}/Betstation", DslEvaluation.PartialForClient, cancellationToken);

        var forms = await clientContentService.GetChildrenAsync($"{path}/Forms", cancellationToken);

        return new
        {
            config.IsMobileLoginEnabled,
            config.IsReCaptchaEnabled,
            config.ConnectCardVersion,
            iframeUrl = string.Empty, // TODO can be removed safely in year 2025
            version = config.Version ?? 1,
            newVisitor = await newVisitorTask,
            loginMessages = await loginMessagesTask,
            connectCard = await connectCardTask,
            betstation = await betstationSectionTask,
            forms = forms.ToDictionary(item => item.InternalId?.ItemName ?? string.Empty),
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
