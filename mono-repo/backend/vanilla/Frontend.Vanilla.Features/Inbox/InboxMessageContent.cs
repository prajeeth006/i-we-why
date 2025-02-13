#nullable disable
namespace Frontend.Vanilla.Features.Inbox;

internal class InboxMessageContent
{
    public string DetailTitle { get; set; }

    public InboxDetailImage DetailImage { get; set; }
    public string InboxImageIntroductoryText { get; set; }
    public string InboxImageSubtitleText { get; set; }
    public string InboxImageTextAlignment { get; set; }
    public string InboxImageTitleFontSize { get; set; }
    public string InboxImageTitleText { get; set; }

    public string DetailDescription { get; set; }

    public string DetailCallToAction { get; set; }

    // List view
    public string ShortImage { get; set; }

    public string SnippetTitle { get; set; }

    public string SnippetDescription { get; set; }

    public string SnippetCallToAction { get; set; }

    public static InboxMessageContent Empty => new InboxMessageContent();

    // T&C appearance configuration
    public bool ExpandTermsAndConditionsByDefault { get; set; }

    public bool ShowManualTermsAndConditions { get; set; }

    public string ManualTermsAndConditions { get; set; }

    public bool IsManualTermsAndConditionsEmpty { get; set; }
    public string HeaderTermsAndConditionsInbox { get; set; }
}
