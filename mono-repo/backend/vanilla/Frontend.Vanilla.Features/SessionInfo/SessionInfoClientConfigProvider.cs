using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.SessionInfo;

internal sealed class SessionInfoClientConfigProvider(ISessionInfoConfiguration sessionInfoConfiguration, IMenuFactory menuFactory) : LambdaClientConfigProvider(
    "vnSessionInfo",
    async cancellationToken =>
    {
        var content = await menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/SessionInfo/SessionInfo", DslEvaluation.FullOnServer, cancellationToken);

        return new
        {
            sessionInfoConfiguration.UrlBlacklist,
            sessionInfoConfiguration.ShowWinningsLosses,
            sessionInfoConfiguration.ShowTotalWager,
            sessionInfoConfiguration.EnableLogoutButton,
            content,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
