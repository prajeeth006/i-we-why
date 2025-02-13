using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Products;

internal sealed class ProductHomepagesClientConfigProvider(IContentService contentService) : LambdaClientConfigProvider("vnProductHomepages",
    async (ct) =>
    {
        var sportsTask = GetLinkUrl(contentService, ct, "sports");
        var casinoTask = GetLinkUrl(contentService, ct, "casino");
        var portalTask = GetLinkUrl(contentService, ct, "portal");
        var pokerTask = GetLinkUrl(contentService, ct, "poker");
        var bingoTask = GetLinkUrl(contentService, ct, "bingo");
        var promoTask = GetLinkUrl(contentService, ct, "promo");
        var lotteryTask = GetLinkUrl(contentService, ct, "lottery");
        var horseracingTask = GetLinkUrl(contentService, ct, "horseracing");
        var dicegamesTask = GetLinkUrl(contentService, ct, "dicegames");
        var virtualsportsTask = GetLinkUrl(contentService, ct, "virtualsports");

        var sports = await sportsTask;
        var casino = await casinoTask;
        var portal = await portalTask;
        var poker = await pokerTask;
        var bingo = await bingoTask;
        var promo = await promoTask;
        var lottery = await lotteryTask;
        var horseracing = await horseracingTask;
        var dicegames = await dicegamesTask;
        var virtualsports = await virtualsportsTask;

        return new
        {
            sports,
            casino,
            portal,
            poker,
            bingo,
            promo,
            lottery,
            horseracing,
            dicegames,
            virtualsports,
        };
    })
{
    private static async Task<string?> GetLinkUrl(IContentService contentService, CancellationToken ct, string p)
    {
        var content = await contentService.GetAsync<ILinkTemplate>(AppPlugin.ContentRoot + "/Links/Home" + p, ct);

        return content?.Url?.ToString();
    }
}
