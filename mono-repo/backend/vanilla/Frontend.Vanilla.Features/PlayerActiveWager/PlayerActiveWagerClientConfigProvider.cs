using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.PlayerActiveWager;

internal sealed class PlayerActiveWagerClientConfigProvider(
    IVanillaClientContentService clientContentService,
    IMenuFactory menuFactory) : LambdaClientConfigProvider("vnPlayerActiveWager", async cancellationToken =>
{
    var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/PlayerWager/WagerMessage", cancellationToken);
    var gotItCta = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/PlayerWager/CtaButton", DslEvaluation.PartialForClient, cancellationToken);

    return new
    {
        content = await contentTask,
        gotItCta = await gotItCta,
    };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
