#nullable disable
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal sealed class NotificationMessageContent
{
    public string MessageId { get; set; }
    public string OverlayHeaderType { get; set; }
    public string OverlayImage { get; set; }
    public string OverlayImageIntroductoryText { get; set; }
    public string OverlayImageSubtitleText { get; set; }
    public string OverlayImageTextAlignment { get; set; }
    public string OverlayImageTitleFontSize { get; set; }
    public string OverlayImageTitleText { get; set; }
    public string OverlayCallToAction { get; set; }
    public string OverlayDescription { get; set; }
    public string OverlayTitle { get; set; }
    public bool RestrictedOverlay { get; set; }
    public string ToasterTitle { get; set; }
    public string TosterImage { get; set; }
    public string ToasterCallToAction { get; set; }
    public string ToasterPrimaryGhostCallToAction { get; set; }
    public string ToasterCloseCallToActionLabel { get; set; }
    public bool ToasterCloseAfterTimeout { get; set; }
    public string ToasterDescription { get; set; }
    public bool UseRewardsOverlay { get; set; }
    public string PreAcceptanceHeaderTitle { get; set; }
    public string PreAcceptanceImage { get; set; }
    public string PreAcceptanceTitle { get; set; }
    public string PreAcceptanceDescription { get; set; }
    public string PreAcceptanceKeyTerms { get; set; }
    public string PreAcceptanceCTA1 { get; set; }
    public string PreAcceptanceCTA2 { get; set; }
    public bool ShowManualTermsAndConditionsOnOverlay { get; set; }
    public string OverlayManualTermsAndConditions { get; set; }
    public string PostAcceptanceHeaderTitle { get; set; }
    public string PostAcceptanceImage { get; set; }
    public string PostAcceptanceTitle { get; set; }
    public string PostAcceptanceDescription { get; set; }
    public string PostAcceptanceCTA { get; set; }
    public string BonusHeader { get; set; }
    public string BonusText { get; set; }
    public ContentImage BonusImage { get; set; }
    public string PreAcceptanceImageIntroductoryText { get; set; }
    public string PreAcceptanceImageSubtitleText { get; set; }
    public string PreAcceptanceImageTitleText { get; set; }
    public string PreAcceptanceImageTextAlignment { get; set; }
    public string PreAcceptanceImageTitleFontSize { get; set; }
    public string PostAcceptanceImageIntroductoryText { get; set; }
    public string PostAcceptanceImageSubtitleText { get; set; }
    public string PostAcceptanceImageTitleText { get; set; }
    public string PostAcceptanceImageTextAlignment { get; set; }
    public string PostAcceptanceImageTitleFontSize { get; set; }
    public string HeaderTermsAndConditionsToaster { get; set; }
    public string HeaderTermsAndConditionsOverlay { get; set; }
    public string HeaderTermsAndConditionsRewardsOverlay { get; set; }
}
