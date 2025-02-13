#nullable disable
using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Base;
using Frontend.Vanilla.Features.Globalization;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Inbox.ContentProviders;

internal class InboxContentProviderBase(IContentService contentService, ILogger log, IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
    : ContentProviderBase<InboxMessageContent>(contentService, log, dateTimeCultureBasedFormatter), IInboxContentProvider
{
    private readonly ILogger logger = log;
    public override string StaticContentPath => "MobileLogin-v1.0/Common/Static/StaticKeyValues";

    protected override InboxMessageContent GenerateResult(
        Dictionary<string, string> replaceableKeysDictionary,
        IDocument offerDoc)
    {
        try
        {
            var doc = offerDoc as IInboxOffer;

            var messageContent = new InboxMessageContent
            {
                DetailTitle = ResolveMessage(replaceableKeysDictionary, doc?.DetailTitle ?? string.Empty),
                DetailImage = new InboxDetailImage(doc?.DetailImage?.Src, doc?.ImageLink),
                InboxImageIntroductoryText = doc?.InboxImageIntroductoryText,
                InboxImageSubtitleText = doc?.InboxImageSubtitleText,
                InboxImageTextAlignment = doc?.InboxImageTextAlignment,
                InboxImageTitleFontSize = doc?.InboxImageTitleFontSize,
                InboxImageTitleText = doc?.InboxImageTitleText,
                DetailDescription = ResolveMessage(replaceableKeysDictionary, doc?.DetailDescription ?? string.Empty),
                DetailCallToAction = ResolveMessage(replaceableKeysDictionary, doc?.DetailCallToAction ?? string.Empty),
                ShortImage = doc?.ShortImage?.Src,
                SnippetTitle = ResolveMessage(replaceableKeysDictionary, doc?.SnippetTitle ?? string.Empty),
                SnippetDescription = ResolveMessage(replaceableKeysDictionary, doc?.SnippetDescription ?? string.Empty),
                SnippetCallToAction = ResolveMessage(replaceableKeysDictionary, doc?.SnippetCallToAction ?? string.Empty),
                ExpandTermsAndConditionsByDefault = doc?.ExpandTermsAndConditionsByDefault ?? false,
                ShowManualTermsAndConditions = doc?.ShowManualTermsAndConditions ?? false,
                HeaderTermsAndConditionsInbox = ResolveMessage(replaceableKeysDictionary, doc?.HeaderTermsAndConditionsInbox ?? string.Empty),
                IsManualTermsAndConditionsEmpty = IsHtmlContentEmpty(doc?.ManualTermsAndConditions),
            };

            if (!messageContent.IsManualTermsAndConditionsEmpty)
            {
                messageContent.ManualTermsAndConditions = ResolveMessage(replaceableKeysDictionary, doc?.ManualTermsAndConditions ?? string.Empty);
            }

            return messageContent;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Sitecore item with {Id} is not of type IInboxOffer", offerDoc?.Metadata?.Id?.ItemName);

            return null;
        }
    }
}
