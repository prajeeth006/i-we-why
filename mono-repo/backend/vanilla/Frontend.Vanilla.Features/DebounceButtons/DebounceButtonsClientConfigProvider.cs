using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.DebounceButtons;

internal sealed class DebounceButtonsClientConfigProvider(IMenuFactory menuFactory) : LambdaClientConfigProvider("vnDebounceButtons", async cancellationToken =>
{
    var debounceButtons = await menuFactory.GetSectionAsync($"{AppPlugin.ContentRoot}/Debounce/Buttons", DslEvaluation.PartialForClient, cancellationToken);

    return new
    {
        debounceButtons?.Items,
    };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
