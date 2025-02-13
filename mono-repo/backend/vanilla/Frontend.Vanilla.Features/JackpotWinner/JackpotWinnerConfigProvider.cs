using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.JackpotWinner;

internal sealed class JackpotWinnerClientConfigProvider(IMenuFactory menuFactory) : LambdaClientConfigProvider("vnJackpotWinner", async cancellationToken =>
{
    var contentTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/GlobalJackpotWinner/WinningMessage", DslEvaluation.PartialForClient, cancellationToken);

    return new
    {
        content = await contentTask,
    };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
