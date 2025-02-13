using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.BottomSheet;

internal class BottomSheetContentClientConfigProvider(IMenuFactory menuFactory) : LambdaClientConfigProvider("vnBottomSheet", async cancellationToken =>
{
    var menu = await menuFactory.GetSectionAsync($"{AppPlugin.ContentRoot}/BottomSheet/Menu", DslEvaluation.PartialForClient, cancellationToken);

    return new { menu };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
