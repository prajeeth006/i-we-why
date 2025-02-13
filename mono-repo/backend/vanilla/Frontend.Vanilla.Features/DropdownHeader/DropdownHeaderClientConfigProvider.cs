using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.DropdownHeader;

internal sealed class DropdownHeaderClientConfigProvider(
    IMenuFactory menuFactory,
    IVanillaClientContentService clientContentService) : LambdaClientConfigProvider("vnDropDownHeader", async cancellationToken =>
{
    var leftItemsTask = menuFactory.GetSectionAsync($"{DropdownHeaderContentPath}/Elements/LeftItems", DslEvaluation.PartialForClient, cancellationToken);
    var linksTask = menuFactory.GetSectionAsync($"{DropdownHeaderContentPath}/Elements/Links", DslEvaluation.PartialForClient, cancellationToken);
    var moreGames = await clientContentService.GetAsync($"{DropdownHeaderContentPath}/MoreGames", cancellationToken);
    var resources = await clientContentService.GetAsync($"{DropdownHeaderContentPath}/Resources", cancellationToken);

    var elements = new
    {
        leftItems = (await leftItemsTask)?.Items,
        links = (await linksTask)?.Items,
    };

    return new
    {
        elements,
        moreGames,
        resources,
    };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    private const string DropdownHeaderContentPath = AppPlugin.ContentRoot + "/DropdownHeader";

    // Run in parallel
}
