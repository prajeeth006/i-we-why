using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.UserSummary;

internal sealed class UserSummaryClientConfigProvider(
    IVanillaClientContentService clientContentService,
    IUserSummaryConfiguration configuration,
    IMenuFactory menuFactory)
    : LambdaClientConfigProvider("vnUserSummary", async cancellationToken =>
    {
        var summarySection =
            await menuFactory.GetSectionAsync($"{AppPlugin.ContentRoot}/UserSummary/SummaryItems", DslEvaluation.PartialForClient, cancellationToken);

        var template = await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/UserSummary/Messages", cancellationToken);

        return new
        {
            configuration.SkipOverlay,
            template,
            summaryItems = summarySection?.Items,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
