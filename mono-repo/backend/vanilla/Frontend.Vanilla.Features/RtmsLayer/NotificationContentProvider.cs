#nullable disable
using System.Collections.Generic;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Base;
using Frontend.Vanilla.Features.Globalization;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal interface INotificationContentProvider : IContentProvider<NotificationMessageContent> { }

internal sealed class NotificationContentProvider(
    IContentService contentService,
    ILogger<NotificationContentProvider> log,
    IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
    : ContentProviderBase<NotificationMessageContent>(contentService, log, dateTimeCultureBasedFormatter),
        INotificationContentProvider
{
    public override string StaticContentPath => AppPlugin.ObsoleteContentRoot + "/Common/Static/StaticKeyValues";

    protected override NotificationMessageContent GenerateResult(
        Dictionary<string, string> replacableKeysDictionary, IDocument offerDoc)
    {
        if (offerDoc is not INotification doc)
        {
            return null;
        }

        return new NotificationMessageContent
        {
            ToasterTitle = ResolveMessage(replacableKeysDictionary, doc.ToasterTitle),
            ToasterDescription = ResolveMessage(replacableKeysDictionary, doc.ToasterDescription),
            ToasterCallToAction = ResolveMessage(replacableKeysDictionary, doc.ToasterCTA),
            ToasterPrimaryGhostCallToAction = ResolveMessage(replacableKeysDictionary, doc.ToasterPrimaryGhostCTA),
            ToasterCloseCallToActionLabel = ResolveMessage(replacableKeysDictionary, doc.ToasterCloseCTALabel),
            TosterImage = doc.TosterImage?.Src,
            ToasterCloseAfterTimeout = doc.ToasterCloseWithTimer,
            OverlayHeaderType = doc.OverlayHeaderType,
            OverlayTitle = ResolveMessage(replacableKeysDictionary, doc.OverlayTitle),
            RestrictedOverlay = doc.RestrictedOverlay,
            OverlayDescription = ResolveMessage(replacableKeysDictionary, doc.OverLayDescription),
            OverlayCallToAction = ResolveMessage(replacableKeysDictionary, doc.OverlayCTA),
            OverlayImage = doc.OverlayImage?.Src,
            OverlayImageIntroductoryText = doc.OverlayImageIntroductoryText,
            OverlayImageSubtitleText = doc.OverlayImageSubtitleText,
            OverlayImageTextAlignment = doc.OverlayImageTextAlignment,
            OverlayImageTitleFontSize = doc.OverlayImageTitleFontSize,
            OverlayImageTitleText = doc.OverlayImageTitleText,
            UseRewardsOverlay = doc.UseRewardsOverlay,
            PreAcceptanceHeaderTitle = ResolveMessage(replacableKeysDictionary, doc.PreAcceptanceHeaderTitle),
            PreAcceptanceImage = doc.PreAcceptanceImage?.Src,
            PreAcceptanceTitle = ResolveMessage(replacableKeysDictionary, doc.PreAcceptanceTitle),
            PreAcceptanceDescription = ResolveMessage(replacableKeysDictionary, doc.PreAcceptanceDescription),
            PreAcceptanceKeyTerms = ResolveMessage(replacableKeysDictionary, doc.PreAcceptanceKeyTerms),
            PreAcceptanceCTA1 = AppendSmartLinkToString(doc.PreAcceptanceCTA1),
            PreAcceptanceCTA2 = AppendSmartLinkToString(doc.PreAcceptanceCTA2),
            ShowManualTermsAndConditionsOnOverlay = doc.ShowManualTermsAndConditionsOnOverlay,
            OverlayManualTermsAndConditions =
                ResolveMessage(replacableKeysDictionary, doc.OverlayManualTermsAndConditions),
            PostAcceptanceHeaderTitle = ResolveMessage(replacableKeysDictionary,
                doc.PostAcceptanceHeaderTitle ?? doc.PreAcceptanceHeaderTitle),
            PostAcceptanceImage = GetImageSrc(doc.PostAcceptanceImage, doc.PreAcceptanceImage),
            PostAcceptanceTitle =
                ResolveMessage(replacableKeysDictionary, doc.PostAcceptanceTitle ?? doc.PreAcceptanceTitle),
            PostAcceptanceDescription = ResolveMessage(replacableKeysDictionary,
                doc.PostAcceptanceDescription ?? doc.PreAcceptanceDescription),
            PostAcceptanceCTA =
                AppendSmartLinkToString(doc.PostAcceptanceCTA != null && doc.PostAcceptanceCTA.Url != null
                    ? doc.PostAcceptanceCTA
                    : doc.PreAcceptanceCTA1),
            PreAcceptanceImageIntroductoryText = doc.PreAcceptanceImageIntroductoryText,
            PreAcceptanceImageSubtitleText = doc.PreAcceptanceImageSubtitleText,
            PreAcceptanceImageTitleText = doc.PreAcceptanceImageTitleText,
            PreAcceptanceImageTextAlignment = doc.PreAcceptanceImageTextAlignment,
            PreAcceptanceImageTitleFontSize = doc.PreAcceptanceImageTitleFontSize,
            PostAcceptanceImageIntroductoryText = doc.PostAcceptanceImageIntroductoryText,
            PostAcceptanceImageSubtitleText = doc.PostAcceptanceImageSubtitleText,
            PostAcceptanceImageTitleText = doc.PostAcceptanceImageTitleText,
            PostAcceptanceImageTextAlignment = doc.PostAcceptanceImageTextAlignment,
            PostAcceptanceImageTitleFontSize = doc.PostAcceptanceImageTitleFontSize,
            HeaderTermsAndConditionsToaster = ResolveMessage(replacableKeysDictionary, doc.HeaderTermsAndConditionsToaster),
            HeaderTermsAndConditionsOverlay = ResolveMessage(replacableKeysDictionary, doc.HeaderTermsAndConditionsOverlay),
            HeaderTermsAndConditionsRewardsOverlay = ResolveMessage(replacableKeysDictionary, doc.HeaderTermsAndConditionsRewardsOverlay),
        };
    }

    private static string AppendSmartLinkToString(ContentLink link)
    {
        var tlink = string.Empty;

        if (link != null)
        {
            var attributes = string.Empty;

            foreach (var attr in link.Attributes)
            {
                var val = attr.Key + " =" + "'" + attr.Value + "' ";
                attributes = attributes + val + " ";
            }

            tlink = "<a " + attributes + " href=" +
                    (link.Url.IsAbsoluteUri ? link.Url.AbsoluteUri : link.Url.OriginalString) + " >" + link.Text +
                    "</a>";
        }

        return tlink;
    }

    private static string GetImageSrc(ContentImage postAcceptanceImage, ContentImage preAcceptanceImage)
    {
        var imgSrc = string.Empty;

        if (postAcceptanceImage != null)
            return postAcceptanceImage.Src;

        return preAcceptanceImage != null ? preAcceptanceImage.Src : imgSrc;
    }
}
