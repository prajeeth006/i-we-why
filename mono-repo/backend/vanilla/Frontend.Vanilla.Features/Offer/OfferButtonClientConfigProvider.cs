using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Offers;

namespace Frontend.Vanilla.Features.Offer;

internal sealed class OfferButtonClientConfigProvider(IContentService contentService, IOffersConfiguration configuration) : LambdaClientConfigProvider("vnOfferButton",
    async cancellationToken =>
    {
        var contentTask = contentService.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/Messages", cancellationToken, Options);

        var buttonClassTask =
            contentService.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/ButtonClass{(configuration.OfferButtonV2 ? "V2" : string.Empty)}",
                cancellationToken,
                Options);

        var iconClassTask = configuration.OfferButtonV2
            ? contentService.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/IconClass", cancellationToken, Options)
            : DefaultResultTask<IViewTemplate?>.Value;

        return new { v2 = configuration.OfferButtonV2, content = await contentTask, buttonClass = await buttonClassTask, iconClass = await iconClassTask };
    })
{
    private static readonly ContentLoadOptions Options = new () { RequireTranslation = true };
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
