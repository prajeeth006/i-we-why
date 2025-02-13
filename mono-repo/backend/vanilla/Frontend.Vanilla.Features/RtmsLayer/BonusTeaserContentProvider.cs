#nullable disable
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.TermsAndConditions;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal interface IBonusTeaserContentProvider
{
    NotificationMessageContent GetBonusContent(IReadOnlyDictionary<string, string> templateMetaData);
}

internal class BonusTeaserContentProvider(
    IContentService contentService,
    ITermsAndConditionsContentProvider termsAndConditionsContentProvider,
    IRtmsLayerConfiguration rtmsLayerConfiguration,
    ILogger<IBonusTeaserContentProvider> log)
    : IBonusTeaserContentProvider
{
    private const string BonusTeaserTemplateKey = "#BONUS_TEASER_TEMPLATE#";

    private IEnumerable<KeyValuePair<string, string>> ReplaceableKeyValuePairs { get; set; }

    /// <summary>
    /// Gets Bonus Content from sitecore.
    /// </summary>
    /// <returns></returns>
    public NotificationMessageContent GetBonusContent(IReadOnlyDictionary<string, string> templateMetaData)
    {
        termsAndConditionsContentProvider.SetReplacementList(templateMetaData);
        ReplaceableKeyValuePairs = termsAndConditionsContentProvider.GetReplacementList();
        // fetch bonus template name from meta data
        templateMetaData.TryGetValue(BonusTeaserTemplateKey, out var bonusTeaserName);

        if (!string.IsNullOrEmpty(bonusTeaserName))
        {
            var path = rtmsLayerConfiguration.BonusSectionByTemplateId != null && rtmsLayerConfiguration.BonusSectionByTemplateId.Any(s => s.Key == bonusTeaserName)
                ? rtmsLayerConfiguration.BonusSectionByTemplateId.FirstOrDefault(s => s.Key == bonusTeaserName).Value
                : string.Format(rtmsLayerConfiguration.BonusSectionTemplate, bonusTeaserName);

            var bonusContent = LoadAndParseBonusItem(path);

            return bonusContent;
        }

        log.LogError("Failed to create bonus overlay from content with {bonusTeaserName}", bonusTeaserName);

        return null;
    }

    /// <summary>
    /// Load Bonus item from sitecore.
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
#pragma warning disable CS8602 // Dereference of a possibly null reference.
    private NotificationMessageContent LoadAndParseBonusItem(string path)
    {
        try
        {
            var bonusFolder = (SuccessContent<IPCContainer>)contentService.GetContent<IPCContainer>(new DocumentId(path));

            // Bonus Image with Text to display
            var imageItems = bonusFolder.Document.Items.Select(id => contentService.GetContent<IPCImage>(id)).ToArray();

            var bonusImage = ((SuccessContent<IPCImage>)imageItems.FirstOrDefault(i =>
                i.Status == DocumentStatus.Success && i.Metadata?.Version > 0 && (i as SuccessContent<IPCImage>)?.Document != null))?.Document;

            // content to display
            var items = bonusFolder.Document.Items.Select(id => contentService.GetContent<IPCText>(id)).ToArray();
            var bonusSectionContent =
                items.Where(i => i is { Status: DocumentStatus.Success, Metadata.Version: > 0 } && (i as SuccessContent<IPCText>)?.Document != null)
                    .Select(i => ((SuccessContent<IPCText>)i).Document).ToArray();

            return ParseBonusResult(bonusImage, bonusSectionContent);
        }
        catch
        {
            log.LogError("Failed to create bonus overlay from content with path: {path}", path);

            return null;
        }
    }
#pragma warning restore CS8602 // Dereference of a possibly null reference.

    /// <summary>
    /// Parses Bonus Result.
    /// </summary>
    /// <param name="bonusItem"></param>
    /// <param name="bonusContent"></param>
    /// <returns></returns>
    private NotificationMessageContent ParseBonusResult(IPCImage bonusItem, IEnumerable<IPCText> bonusContent)
    {
        var pcTexts = bonusContent as IPCText[] ?? bonusContent.ToArray();

        var notificationMessageContent = new NotificationMessageContent()
        {
            BonusHeader = termsAndConditionsContentProvider.ParseTemplateAndReplacePlaceholders(ReplaceableKeyValuePairs, GetBonusItem(pcTexts, "Header")),
            BonusImage = bonusItem?.Image,
            BonusText = termsAndConditionsContentProvider.ParseTemplateAndReplacePlaceholders(ReplaceableKeyValuePairs, GetBonusItem(pcTexts, "Content")),
        };

        return notificationMessageContent;
    }

    /// <summary>
    /// Get Bonus item from IPCText array.
    /// </summary>
    /// <param name="bonusContent"></param>
    /// <param name="title"></param>
    /// <returns></returns>
    private static string GetBonusItem(IEnumerable<IPCText> bonusContent, string title)
    {
        var text = bonusContent.FirstOrDefault(c => c.Title == title)?.Text;

        return text ?? string.Empty;
    }
}
