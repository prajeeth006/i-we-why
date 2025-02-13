using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.VisualBasic;

namespace Frontend.Vanilla.Features.RangeDatepicker;

internal sealed class RangeDatepickerClientConfigProvider(IVanillaClientContentService clientContentService, IRangeDatepickerConfiguration config) : LambdaClientConfigProvider("vnRangeDatepicker",
    async cancellationToken =>
    {
        var templates = await clientContentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/RangeDatepicker", cancellationToken, DslEvaluation.PartialForClient);

        return new
        {
            templates = templates.ToDictionary(item => item.InternalId?.ItemName ?? string.Empty),
            firstDayOfWeek = config.FirstDayOfWeek,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
