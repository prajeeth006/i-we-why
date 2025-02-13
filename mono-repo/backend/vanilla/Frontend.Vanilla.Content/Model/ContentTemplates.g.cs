#pragma warning disable 1591
#nullable enable
using Frontend.Vanilla.Core.System;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;


namespace Frontend.Vanilla.Content.Model
{
    /// <summary>
    /// Interface that maps to the <c>Base Template</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Base Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IBaseTemplate : Frontend.Vanilla.Content.IDocument
    {    }

    /// <summary>
    /// Interface that maps to the <c>CampaignAssets</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CampaignAssets", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ICampaignAssets : ICampaignPromoEmail, ICampaignSMS, IEligibiltyCriteria, IInboxOffer, INotification, IOptimoveIntegration, IRetention, ISignposting
    {
        /// <summary> 
        /// Property that maps to the <c>CommonCTA</c> content field.
        /// </summary>
        ContentLink? CommonCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonCTAPreview</c> content field.
        /// </summary>
        ContentLink? CommonCTAPreview { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonDescription</c> content field.
        /// </summary>
        string? CommonDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonDescriptionPreview</c> content field.
        /// </summary>
        string? CommonDescriptionPreview { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonImageLandscape</c> content field.
        /// </summary>
        ContentImage? CommonImageLandscape { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonImageSquare</c> content field.
        /// </summary>
        ContentImage? CommonImageSquare { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonTermsAndConditions</c> content field.
        /// </summary>
        string? CommonTermsAndConditions { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonTitle</c> content field.
        /// </summary>
        string? CommonTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>CommonTitlePreview</c> content field.
        /// </summary>
        string? CommonTitlePreview { get; }

        /// <summary> 
        /// Property that maps to the <c>MarketTypes</c> content field.
        /// </summary>
        string? MarketTypes { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>CampaignPromoEmail</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CampaignPromoEmail", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ICampaignPromoEmail : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>ctaPosition1</c> content field.
        /// </summary>
        string? CtaPosition1 { get; }

        /// <summary> 
        /// Property that maps to the <c>EmailCTA</c> content field.
        /// </summary>
        ContentLink? EmailCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>EmailImage</c> content field.
        /// </summary>
        ContentImage? EmailImage { get; }

        /// <summary> 
        /// Property that maps to the <c>EmailSubject</c> content field.
        /// </summary>
        string? EmailSubject { get; }

        /// <summary> 
        /// Property that maps to the <c>EmailText</c> content field.
        /// </summary>
        string? EmailText { get; }

        /// <summary> 
        /// Property that maps to the <c>EmailTitle</c> content field.
        /// </summary>
        string? EmailTitle { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>CampaignSMS</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CampaignSMS", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ICampaignSMS : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>SMSText</c> content field.
        /// </summary>
        string? SMSText { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>CommonDetails</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CommonDetails", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ICommonDetails : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>Description</c> content field.
        /// </summary>
        string? Description { get; }

        /// <summary> 
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>EligibiltyCriteria</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("EligibiltyCriteria", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IEligibiltyCriteria : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>EligibilityCriteriaInfo</c> content field.
        /// </summary>
        string? EligibilityCriteriaInfo { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Filter Template</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Filter Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IFilterTemplate : IBaseTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>Condition</c> content field.
        /// </summary>
        string? Condition { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Folder</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Folder", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IFolder : Frontend.Vanilla.Content.IDocument
    {    }

    /// <summary>
    /// Interface that maps to the <c>Form Element Template</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Form Element Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IFormElementTemplate : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>HtmlAttributes</c> content field.
        /// </summary>
        ContentParameters HtmlAttributes { get; }

        /// <summary> 
        /// Property that maps to the <c>Label</c> content field.
        /// </summary>
        string? Label { get; }

        /// <summary> 
        /// Property that maps to the <c>ToolTip</c> content field.
        /// </summary>
        string? ToolTip { get; }

        /// <summary> 
        /// Property that maps to the <c>Validation</c> content field.
        /// </summary>
        ContentParameters Validation { get; }

        /// <summary> 
        /// Property that maps to the <c>Values</c> content field.
        /// </summary>
        IReadOnlyList<ListItem> Values { get; }

        /// <summary> 
        /// Property that maps to the <c>Watermark</c> content field.
        /// </summary>
        string? Watermark { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>GenericListItem</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GenericListItem", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGenericListItem : IBaseTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>SharedList</c> content field.
        /// </summary>
        ContentParameters SharedList { get; }

        /// <summary> 
        /// Property that maps to the <c>VersionedList</c> content field.
        /// </summary>
        ContentParameters VersionedList { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>InboxOffer</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("InboxOffer", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IInboxOffer : INotification, IOptimoveIntegration, IRetention
    {
        /// <summary> 
        /// Property that maps to the <c>DetailCallToAction</c> content field.
        /// </summary>
        string? DetailCallToAction { get; }

        /// <summary> 
        /// Property that maps to the <c>DetailDescription</c> content field.
        /// </summary>
        string? DetailDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>DetailImage</c> content field.
        /// </summary>
        ContentImage? DetailImage { get; }

        /// <summary> 
        /// Property that maps to the <c>DetailTitle</c> content field.
        /// </summary>
        string? DetailTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>ExpandTermsAndConditionsByDefault</c> content field.
        /// </summary>
        bool ExpandTermsAndConditionsByDefault { get; }

        /// <summary> 
        /// Property that maps to the <c>HeaderTermsAndConditionsInbox</c> content field.
        /// </summary>
        string? HeaderTermsAndConditionsInbox { get; }

        /// <summary> 
        /// Property that maps to the <c>ImageLink</c> content field.
        /// </summary>
        ContentLink? ImageLink { get; }

        /// <summary> 
        /// Property that maps to the <c>InboxImageIntroductoryText</c> content field.
        /// </summary>
        string? InboxImageIntroductoryText { get; }

        /// <summary> 
        /// Property that maps to the <c>InboxImageSubtitleText</c> content field.
        /// </summary>
        string? InboxImageSubtitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>InboxImageTextAlignment</c> content field.
        /// </summary>
        string? InboxImageTextAlignment { get; }

        /// <summary> 
        /// Property that maps to the <c>InboxImageTitleFontSize</c> content field.
        /// </summary>
        string? InboxImageTitleFontSize { get; }

        /// <summary> 
        /// Property that maps to the <c>InboxImageTitleText</c> content field.
        /// </summary>
        string? InboxImageTitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>InboxLayout</c> content field.
        /// </summary>
        DocumentId? InboxLayout { get; }

        /// <summary> 
        /// Property that maps to the <c>ManualTermsAndConditions</c> content field.
        /// </summary>
        string? ManualTermsAndConditions { get; }

        /// <summary> 
        /// Property that maps to the <c>ShortImage</c> content field.
        /// </summary>
        ContentImage? ShortImage { get; }

        /// <summary> 
        /// Property that maps to the <c>ShowManualTermsAndConditions</c> content field.
        /// </summary>
        bool ShowManualTermsAndConditions { get; }

        /// <summary> 
        /// Property that maps to the <c>SnippetCallToAction</c> content field.
        /// </summary>
        string? SnippetCallToAction { get; }

        /// <summary> 
        /// Property that maps to the <c>SnippetDescription</c> content field.
        /// </summary>
        string? SnippetDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>SnippetTitle</c> content field.
        /// </summary>
        string? SnippetTitle { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Json</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Json", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IJson : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>Json</c> content field.
        /// </summary>
        string? Json { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>LinkTemplate</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LinkTemplate", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ILinkTemplate : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>FrameTarget</c> content field.
        /// </summary>
        string? FrameTarget { get; }

        /// <summary> 
        /// Property that maps to the <c>HtmlAttributes</c> content field.
        /// </summary>
        ContentParameters HtmlAttributes { get; }

        /// <summary> 
        /// Property that maps to the <c>Link</c> content field.
        /// </summary>
        ContentLink? Link { get; }

        /// <summary> 
        /// Property that maps to the <c>LinkText</c> content field.
        /// </summary>
        string? LinkText { get; }

        /// <summary> 
        /// Property that maps to the <c>Name</c> content field.
        /// </summary>
        string? Name { get; }

        /// <summary> 
        /// Property that maps to the <c>NoFollow</c> content field.
        /// </summary>
        bool NoFollow { get; }

        /// <summary> 
        /// Property that maps to the <c>ToolTip</c> content field.
        /// </summary>
        string? ToolTip { get; }

        /// <summary> 
        /// Property that maps to the <c>Url</c> content field.
        /// </summary>
        Uri? Url { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Menu Item Template</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Menu Item Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IMenuItemTemplate : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>HtmlAttributes</c> content field.
        /// </summary>
        ContentParameters HtmlAttributes { get; }

        /// <summary> 
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary> 
        /// Property that maps to the <c>LinkReference</c> content field.
        /// </summary>
        ContentLink? LinkReference { get; }

        /// <summary> 
        /// Property that maps to the <c>LinkText</c> content field.
        /// </summary>
        string? LinkText { get; }

        /// <summary> 
        /// Property that maps to the <c>SubNavigationContainer</c> content field.
        /// </summary>
        string? SubNavigationContainer { get; }

        /// <summary> 
        /// Property that maps to the <c>ToolTip</c> content field.
        /// </summary>
        string? ToolTip { get; }

        /// <summary> 
        /// Property that maps to the <c>WebAnalytics</c> content field.
        /// </summary>
        string? WebAnalytics { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>MenuItem</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MenuItem", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IMenuItem : IBaseTemplate, IFilterTemplate, ISvgImage
    {
        /// <summary> 
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary> 
        /// Property that maps to the <c>Link</c> content field.
        /// </summary>
        ContentLink? Link { get; }

        /// <summary> 
        /// Property that maps to the <c>Parameters</c> content field.
        /// </summary>
        ContentParameters Parameters { get; }

        /// <summary> 
        /// Property that maps to the <c>Resources</c> content field.
        /// </summary>
        ContentParameters Resources { get; }

        /// <summary> 
        /// Property that maps to the <c>Text</c> content field.
        /// </summary>
        string? Text { get; }

        /// <summary> 
        /// Property that maps to the <c>ToolTip</c> content field.
        /// </summary>
        string? ToolTip { get; }

        /// <summary> 
        /// Property that maps to the <c>WebAnalytics</c> content field.
        /// </summary>
        string? WebAnalytics { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>MenuItemStatic</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MenuItemStatic", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IMenuItemStatic : IMenuItem
    {    }

    /// <summary>
    /// Interface that maps to the <c>Notification</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Notification", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface INotification : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>CTANativeLink</c> content field.
        /// </summary>
        ContentLink? CTANativeLink { get; }

        /// <summary> 
        /// Property that maps to the <c>HeaderTermsAndConditionsOverlay</c> content field.
        /// </summary>
        string? HeaderTermsAndConditionsOverlay { get; }

        /// <summary> 
        /// Property that maps to the <c>HeaderTermsAndConditionsRewardsOverlay</c> content field.
        /// </summary>
        string? HeaderTermsAndConditionsRewardsOverlay { get; }

        /// <summary> 
        /// Property that maps to the <c>HeaderTermsAndConditionsToaster</c> content field.
        /// </summary>
        string? HeaderTermsAndConditionsToaster { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayCTA</c> content field.
        /// </summary>
        string? OverlayCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>OverLayDescription</c> content field.
        /// </summary>
        string? OverLayDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayHeaderType</c> content field.
        /// </summary>
        string? OverlayHeaderType { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayImage</c> content field.
        /// </summary>
        ContentImage? OverlayImage { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayImageIntroductoryText</c> content field.
        /// </summary>
        string? OverlayImageIntroductoryText { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayImageSubtitleText</c> content field.
        /// </summary>
        string? OverlayImageSubtitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayImageTextAlignment</c> content field.
        /// </summary>
        string? OverlayImageTextAlignment { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayImageTitleFontSize</c> content field.
        /// </summary>
        string? OverlayImageTitleFontSize { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayImageTitleText</c> content field.
        /// </summary>
        string? OverlayImageTitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayLayout</c> content field.
        /// </summary>
        DocumentId? OverlayLayout { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayManualTermsAndConditions</c> content field.
        /// </summary>
        string? OverlayManualTermsAndConditions { get; }

        /// <summary> 
        /// Property that maps to the <c>OverlayTitle</c> content field.
        /// </summary>
        string? OverlayTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceCTA</c> content field.
        /// </summary>
        ContentLink? PostAcceptanceCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceDescription</c> content field.
        /// </summary>
        string? PostAcceptanceDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceHeaderTitle</c> content field.
        /// </summary>
        string? PostAcceptanceHeaderTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceImage</c> content field.
        /// </summary>
        ContentImage? PostAcceptanceImage { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceImageIntroductoryText</c> content field.
        /// </summary>
        string? PostAcceptanceImageIntroductoryText { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceImageSubtitleText</c> content field.
        /// </summary>
        string? PostAcceptanceImageSubtitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceImageTextAlignment</c> content field.
        /// </summary>
        string? PostAcceptanceImageTextAlignment { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceImageTitleFontSize</c> content field.
        /// </summary>
        string? PostAcceptanceImageTitleFontSize { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceImageTitleText</c> content field.
        /// </summary>
        string? PostAcceptanceImageTitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>PostAcceptanceTitle</c> content field.
        /// </summary>
        string? PostAcceptanceTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceCTA1</c> content field.
        /// </summary>
        ContentLink? PreAcceptanceCTA1 { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceCTA2</c> content field.
        /// </summary>
        ContentLink? PreAcceptanceCTA2 { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceDescription</c> content field.
        /// </summary>
        string? PreAcceptanceDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceHeaderTitle</c> content field.
        /// </summary>
        string? PreAcceptanceHeaderTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceImage</c> content field.
        /// </summary>
        ContentImage? PreAcceptanceImage { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceImageIntroductoryText</c> content field.
        /// </summary>
        string? PreAcceptanceImageIntroductoryText { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceImageSubtitleText</c> content field.
        /// </summary>
        string? PreAcceptanceImageSubtitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceImageTextAlignment</c> content field.
        /// </summary>
        string? PreAcceptanceImageTextAlignment { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceImageTitleFontSize</c> content field.
        /// </summary>
        string? PreAcceptanceImageTitleFontSize { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceImageTitleText</c> content field.
        /// </summary>
        string? PreAcceptanceImageTitleText { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceKeyTerms</c> content field.
        /// </summary>
        string? PreAcceptanceKeyTerms { get; }

        /// <summary> 
        /// Property that maps to the <c>PreAcceptanceTitle</c> content field.
        /// </summary>
        string? PreAcceptanceTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>RestrictedOverlay</c> content field.
        /// </summary>
        bool RestrictedOverlay { get; }

        /// <summary> 
        /// Property that maps to the <c>RewardsOverlayLayout</c> content field.
        /// </summary>
        DocumentId? RewardsOverlayLayout { get; }

        /// <summary> 
        /// Property that maps to the <c>ShowManualTermsAndConditionsOnOverlay</c> content field.
        /// </summary>
        bool ShowManualTermsAndConditionsOnOverlay { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterCloseCTALabel</c> content field.
        /// </summary>
        string? ToasterCloseCTALabel { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterCloseWithTimer</c> content field.
        /// </summary>
        bool ToasterCloseWithTimer { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterCTA</c> content field.
        /// </summary>
        string? ToasterCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterDescription</c> content field.
        /// </summary>
        string? ToasterDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterLayout</c> content field.
        /// </summary>
        DocumentId? ToasterLayout { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterPrimaryGhostCTA</c> content field.
        /// </summary>
        string? ToasterPrimaryGhostCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>ToasterTitle</c> content field.
        /// </summary>
        string? ToasterTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>TosterImage</c> content field.
        /// </summary>
        ContentImage? TosterImage { get; }

        /// <summary> 
        /// Property that maps to the <c>UseRewardsOverlay</c> content field.
        /// </summary>
        bool UseRewardsOverlay { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>OptimoveIntegration</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("OptimoveIntegration", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IOptimoveIntegration : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>OptimoveInstance</c> content field.
        /// </summary>
        string? OptimoveInstance { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PC Menu</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PC Menu", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCMenu : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Depth</c> content field.
        /// </summary>
        int Depth { get; }

        /// <summary> 
        /// Property that maps to the <c>HighlightParents</c> content field.
        /// </summary>
        bool HighlightParents { get; }

        /// <summary> 
        /// Property that maps to the <c>MenuNode</c> content field.
        /// </summary>
        DocumentId? MenuNode { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PC Sandbox</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PC Sandbox", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCSandbox : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>FallbackContent</c> content field.
        /// </summary>
        DocumentId? FallbackContent { get; }

        /// <summary> 
        /// Property that maps to the <c>MaxResponseTime</c> content field.
        /// </summary>
        int MaxResponseTime { get; }

        /// <summary> 
        /// Property that maps to the <c>WidgetUrl</c> content field.
        /// </summary>
        ContentLink? WidgetUrl { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PC Teaser</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PC Teaser", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCTeaser : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary> 
        /// Property that maps to the <c>ImageLink</c> content field.
        /// </summary>
        ContentLink? ImageLink { get; }

        /// <summary> 
        /// Property that maps to the <c>ImageOverlay</c> content field.
        /// </summary>
        ContentImage? ImageOverlay { get; }

        /// <summary> 
        /// Property that maps to the <c>ImageOverlayClass</c> content field.
        /// </summary>
        string? ImageOverlayClass { get; }

        /// <summary> 
        /// Property that maps to the <c>OptionalText</c> content field.
        /// </summary>
        string? OptionalText { get; }

        /// <summary> 
        /// Property that maps to the <c>Subtitle</c> content field.
        /// </summary>
        string? Subtitle { get; }

        /// <summary> 
        /// Property that maps to the <c>Summary</c> content field.
        /// </summary>
        string? Summary { get; }

        /// <summary> 
        /// Property that maps to the <c>Text</c> content field.
        /// </summary>
        string? Text { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCBaseComponent</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCBaseComponent", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCBaseComponent : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>Class</c> content field.
        /// </summary>
        string? Class { get; }

        /// <summary> 
        /// Property that maps to the <c>Parameters</c> content field.
        /// </summary>
        ContentParameters Parameters { get; }

        /// <summary> 
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }

        /// <summary> 
        /// Property that maps to the <c>TitleLink</c> content field.
        /// </summary>
        ContentLink? TitleLink { get; }

        /// <summary> 
        /// Property that maps to the <c>TridZone</c> content field.
        /// </summary>
        string? TridZone { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCCarousel</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCCarousel", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCCarousel : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>MaxItems</c> content field.
        /// </summary>
        int MaxItems { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCComponentFolder</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCComponentFolder", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCComponentFolder : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>MaxItems</c> content field.
        /// </summary>
        int MaxItems { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCContainer</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCContainer", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCContainer : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Items</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Items { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCFlash</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCFlash", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCFlash : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>BGColor</c> content field.
        /// </summary>
        string? BGColor { get; }

        /// <summary> 
        /// Property that maps to the <c>Flash</c> content field.
        /// </summary>
        string? Flash { get; }

        /// <summary> 
        /// Property that maps to the <c>FlashVariables</c> content field.
        /// </summary>
        string? FlashVariables { get; }

        /// <summary> 
        /// Property that maps to the <c>Height</c> content field.
        /// </summary>
        int Height { get; }

        /// <summary> 
        /// Property that maps to the <c>ReplacementImage</c> content field.
        /// </summary>
        ContentImage? ReplacementImage { get; }

        /// <summary> 
        /// Property that maps to the <c>ReplacementText</c> content field.
        /// </summary>
        string? ReplacementText { get; }

        /// <summary> 
        /// Property that maps to the <c>Width</c> content field.
        /// </summary>
        int Width { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCIFrame</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCIFrame", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCIFrame : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Height</c> content field.
        /// </summary>
        int Height { get; }

        /// <summary> 
        /// Property that maps to the <c>Src</c> content field.
        /// </summary>
        ContentLink? Src { get; }

        /// <summary> 
        /// Property that maps to the <c>Width</c> content field.
        /// </summary>
        int Width { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCImage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCImage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCImage : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>IconName</c> content field.
        /// </summary>
        string? IconName { get; }

        /// <summary> 
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary> 
        /// Property that maps to the <c>ImageLink</c> content field.
        /// </summary>
        ContentLink? ImageLink { get; }

        /// <summary> 
        /// Property that maps to the <c>ToolTip</c> content field.
        /// </summary>
        string? ToolTip { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCImageText</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCImageText", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCImageText : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary> 
        /// Property that maps to the <c>ImageLink</c> content field.
        /// </summary>
        ContentLink? ImageLink { get; }

        /// <summary> 
        /// Property that maps to the <c>Text</c> content field.
        /// </summary>
        string? Text { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCRawHtml</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCRawHtml", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCRawHtml : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>Html</c> content field.
        /// </summary>
        string? Html { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCRegionalComponent</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCRegionalComponent", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCRegionalComponent : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>RegionItems</c> content field.
        /// </summary>
        IReadOnlyList<KeyValuePair<string,DocumentId>> RegionItems { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCScript</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCScript", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCScript : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>Code</c> content field.
        /// </summary>
        string? Code { get; }

        /// <summary> 
        /// Property that maps to the <c>IsFooter</c> content field.
        /// </summary>
        bool IsFooter { get; }

        /// <summary> 
        /// Property that maps to the <c>Reference</c> content field.
        /// </summary>
        ContentLink? Reference { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCScrollMenu</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCScrollMenu", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCScrollMenu : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>MenuItems</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> MenuItems { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCStyle</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCStyle", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCStyle : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>CSS</c> content field.
        /// </summary>
        string? CSS { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCText</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCText", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCText : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Text</c> content field.
        /// </summary>
        string? Text { get; }    
    }

    /// <summary>
    /// Interface that maps to the <c>PCVideo</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCVideo", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCVideo : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>Controls</c> content field.
        /// </summary>
        bool Controls { get; }

        /// <summary> 
        /// Property that maps to the <c>Video</c> content field.
        /// </summary>
        ContentVideo? Video { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PCWidget</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCWidget", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPCWidget : IBaseTemplate, IFilterTemplate, IPCBaseComponent
    {
        /// <summary> 
        /// Property that maps to the <c>RouteValues</c> content field.
        /// </summary>
        ContentParameters RouteValues { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Plugin Root</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Plugin Root", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPluginRoot : IBaseTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>DependentTo</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> DependentTo { get; }

        /// <summary> 
        /// Property that maps to the <c>Messages</c> content field.
        /// </summary>
        ContentParameters Messages { get; }

        /// <summary> 
        /// Property that maps to the <c>Product</c> content field.
        /// </summary>
        string? Product { get; }

        /// <summary> 
        /// Property that maps to the <c>ProductContact</c> content field.
        /// </summary>
        string? ProductContact { get; }

        /// <summary> 
        /// Property that maps to the <c>TechnicalContact</c> content field.
        /// </summary>
        string? TechnicalContact { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PM12ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PM12ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPM12ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>Banner</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Banner { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentLeft</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentLeft { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentRight</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentRight { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PM1ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PM1ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPM1ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>Content</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Content { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PM2ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PM2ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPM2ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>ContentLeft</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentLeft { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentRight</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentRight { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PMBasePage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMBasePage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPMBasePage : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>PageAlternateLinks</c> content field.
        /// </summary>
        ContentParameters PageAlternateLinks { get; }

        /// <summary> 
        /// Property that maps to the <c>PageAssets</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> PageAssets { get; }

        /// <summary> 
        /// Property that maps to the <c>PageClass</c> content field.
        /// </summary>
        string? PageClass { get; }

        /// <summary> 
        /// Property that maps to the <c>PageDescription</c> content field.
        /// </summary>
        string? PageDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>PageId</c> content field.
        /// </summary>
        string? PageId { get; }

        /// <summary> 
        /// Property that maps to the <c>PageMetaTags</c> content field.
        /// </summary>
        ContentParameters PageMetaTags { get; }

        /// <summary> 
        /// Property that maps to the <c>PageTitle</c> content field.
        /// </summary>
        string? PageTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>Parameters</c> content field.
        /// </summary>
        ContentParameters Parameters { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PMNav12ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMNav12ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPMNav12ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>Banner</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Banner { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentLeft</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentLeft { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentRight</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentRight { get; }

        /// <summary> 
        /// Property that maps to the <c>Navigation</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Navigation { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PMNav13ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMNav13ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPMNav13ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>Banner</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Banner { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentCenter</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentCenter { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentLeft</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentLeft { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentRight</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentRight { get; }

        /// <summary> 
        /// Property that maps to the <c>Navigation</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Navigation { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PMNav1ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMNav1ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPMNav1ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>Content</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Content { get; }

        /// <summary> 
        /// Property that maps to the <c>Navigation</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Navigation { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>PMSignpost12ColPage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMSignpost12ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IPMSignpost12ColPage : IPMBasePage
    {
        /// <summary> 
        /// Property that maps to the <c>Banner</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Banner { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentLeft</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentLeft { get; }

        /// <summary> 
        /// Property that maps to the <c>ContentRight</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> ContentRight { get; }

        /// <summary> 
        /// Property that maps to the <c>Signpost</c> content field.
        /// </summary>
        IReadOnlyList<DocumentId> Signpost { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Proxy</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Proxy", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IProxy : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>Target</c> content field.
        /// </summary>
        IReadOnlyList<ProxyRule> Target { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ProxyFolder</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ProxyFolder", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IProxyFolder : Frontend.Vanilla.Content.IDocument
    {    }

    /// <summary>
    /// Interface that maps to the <c>Retention</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Retention", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IRetention : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>ValidUpTo</c> content field.
        /// </summary>
        UtcDateTime ValidUpTo { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Signposting</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Signposting", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISignposting : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>BackgroundBannerImage</c> content field.
        /// </summary>
        ContentImage? BackgroundBannerImage { get; }

        /// <summary> 
        /// Property that maps to the <c>BannerDescription</c> content field.
        /// </summary>
        string? BannerDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>BannerKeyTerms</c> content field.
        /// </summary>
        string? BannerKeyTerms { get; }

        /// <summary> 
        /// Property that maps to the <c>BannerTitle</c> content field.
        /// </summary>
        string? BannerTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>DetailsTermsAndConditions</c> content field.
        /// </summary>
        string? DetailsTermsAndConditions { get; }

        /// <summary> 
        /// Property that maps to the <c>HeroBannerImage</c> content field.
        /// </summary>
        ContentImage? HeroBannerImage { get; }

        /// <summary> 
        /// Property that maps to the <c>MoreinfoCTA</c> content field.
        /// </summary>
        ContentLink? MoreinfoCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>OptinCTATitle</c> content field.
        /// </summary>
        string? OptinCTATitle { get; }

        /// <summary> 
        /// Property that maps to the <c>OptionalCTA</c> content field.
        /// </summary>
        ContentLink? OptionalCTA { get; }

        /// <summary> 
        /// Property that maps to the <c>PromoDetailsBackgroundImage</c> content field.
        /// </summary>
        ContentImage? PromoDetailsBackgroundImage { get; }

        /// <summary> 
        /// Property that maps to the <c>PromoDetailsDescription</c> content field.
        /// </summary>
        string? PromoDetailsDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>PromoDetailsHeroImage</c> content field.
        /// </summary>
        ContentImage? PromoDetailsHeroImage { get; }

        /// <summary> 
        /// Property that maps to the <c>PromoDetailsTitle</c> content field.
        /// </summary>
        string? PromoDetailsTitle { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Site Root</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Site Root", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISiteRoot : IBaseTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>CanonicalDomains</c> content field.
        /// </summary>
        ContentParameters CanonicalDomains { get; }

        /// <summary> 
        /// Property that maps to the <c>DefaultPageTitle</c> content field.
        /// </summary>
        string? DefaultPageTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>ReplacementValues</c> content field.
        /// </summary>
        ContentParameters ReplacementValues { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>StaticFileTemplate</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("StaticFileTemplate", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IStaticFileTemplate : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>ClientCacheTime</c> content field.
        /// </summary>
        int ClientCacheTime { get; }

        /// <summary> 
        /// Property that maps to the <c>Content</c> content field.
        /// </summary>
        string? Content { get; }

        /// <summary> 
        /// Property that maps to the <c>MimeType</c> content field.
        /// </summary>
        string? MimeType { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>SvgImage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SvgImage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISvgImage : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>CssClass</c> content field.
        /// </summary>
        string? CssClass { get; }

        /// <summary> 
        /// Property that maps to the <c>CustomAnimation</c> content field.
        /// </summary>
        string? CustomAnimation { get; }

        /// <summary> 
        /// Property that maps to the <c>DefaultAnimation</c> content field.
        /// </summary>
        bool DefaultAnimation { get; }

        /// <summary> 
        /// Property that maps to the <c>Size</c> content field.
        /// </summary>
        string? Size { get; }

        /// <summary> 
        /// Property that maps to the <c>SvgImage</c> content field.
        /// </summary>
        ContentImage? SvgImage { get; }

        /// <summary> 
        /// Property that maps to the <c>Type</c> content field.
        /// </summary>
        string? Type { get; }

        /// <summary> 
        /// Property that maps to the <c>ViewBox</c> content field.
        /// </summary>
        string? ViewBox { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>View Template</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("View Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IViewTemplate : IBaseTemplate, IFilterTemplate
    {
        /// <summary> 
        /// Property that maps to the <c>Messages</c> content field.
        /// </summary>
        ContentParameters Messages { get; }

        /// <summary> 
        /// Property that maps to the <c>PageDescription</c> content field.
        /// </summary>
        string? PageDescription { get; }

        /// <summary> 
        /// Property that maps to the <c>PageTitle</c> content field.
        /// </summary>
        string? PageTitle { get; }

        /// <summary> 
        /// Property that maps to the <c>Text</c> content field.
        /// </summary>
        string? Text { get; }

        /// <summary> 
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }

        /// <summary> 
        /// Property that maps to the <c>Validation</c> content field.
        /// </summary>
        ContentParameters Validation { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>VnIcon</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("VnIcon", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IVnIcon : Frontend.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>ExtraClass</c> content field.
        /// </summary>
        string? ExtraClass { get; }

        /// <summary> 
        /// Property that maps to the <c>FillColor</c> content field.
        /// </summary>
        string? FillColor { get; }

        /// <summary> 
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary> 
        /// Property that maps to the <c>Size</c> content field.
        /// </summary>
        string? Size { get; }

        /// <summary> 
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }
    }
}

namespace Frontend.Vanilla.Content.Model.Implementation
{
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Base Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class BaseTemplateDocument : Frontend.Vanilla.Content.Document,IBaseTemplate
    {
        public BaseTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CampaignAssets", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class CampaignAssetsDocument : Frontend.Vanilla.Content.Document,ICampaignAssets
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BackgroundBannerImage", "Image", shared: true)]
        public ContentImage BackgroundBannerImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BannerDescription", "Rich Text", shared: false)]
        public string BannerDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BannerKeyTerms", "Rich Text", shared: false)]
        public string BannerKeyTerms { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BannerTitle", "Single-Line Text", shared: false)]
        public string BannerTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonCTA", "SmartLink", shared: false)]
        public ContentLink CommonCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonCTAPreview", "SmartLink", shared: false)]
        public ContentLink CommonCTAPreview { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonDescription", "Rich Text", shared: false)]
        public string CommonDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonDescriptionPreview", "Rich Text", shared: false)]
        public string CommonDescriptionPreview { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonImageLandscape", "Image", shared: true)]
        public ContentImage CommonImageLandscape { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonImageSquare", "Image", shared: true)]
        public ContentImage CommonImageSquare { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonTermsAndConditions", "Rich Text", shared: false)]
        public string CommonTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonTitle", "Single-Line Text", shared: false)]
        public string CommonTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CommonTitlePreview", "Single-Line Text", shared: false)]
        public string CommonTitlePreview { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CTANativeLink", "SmartLink", shared: false)]
        public ContentLink CTANativeLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ctaPosition1", "Single-Line Text", shared: false)]
        public string CtaPosition1 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailCallToAction", "Rich Text", shared: false)]
        public string DetailCallToAction { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailDescription", "Rich Text", shared: false)]
        public string DetailDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailImage", "Image", shared: true)]
        public ContentImage DetailImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailsTermsAndConditions", "Rich Text", shared: false)]
        public string DetailsTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailTitle", "Single-Line Text", shared: false)]
        public string DetailTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EligibilityCriteriaInfo", "Rich Text", shared: false)]
        public string EligibilityCriteriaInfo { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailCTA", "SmartLink", shared: false)]
        public ContentLink EmailCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailImage", "Image", shared: true)]
        public ContentImage EmailImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailSubject", "Single-Line Text", shared: false)]
        public string EmailSubject { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailText", "Rich Text", shared: false)]
        public string EmailText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailTitle", "Single-Line Text", shared: false)]
        public string EmailTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ExpandTermsAndConditionsByDefault", "Checkbox", shared: true)]
        public bool ExpandTermsAndConditionsByDefault { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsInbox", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsInbox { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsOverlay", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsRewardsOverlay", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsRewardsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsToaster", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsToaster { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeroBannerImage", "Image", shared: true)]
        public ContentImage HeroBannerImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageLink", "SmartLink", shared: false)]
        public ContentLink ImageLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageIntroductoryText", "Single-Line Text", shared: false)]
        public string InboxImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageSubtitleText", "Single-Line Text", shared: false)]
        public string InboxImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageTextAlignment", "Droplist", shared: false)]
        public string InboxImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageTitleFontSize", "Droplist", shared: false)]
        public string InboxImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageTitleText", "Single-Line Text", shared: false)]
        public string InboxImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxLayout", "Droptree", shared: true)]
        public DocumentId InboxLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ManualTermsAndConditions", "Rich Text", shared: false)]
        public string ManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MarketTypes", "Multi-Line Text", shared: false)]
        public string MarketTypes { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MoreinfoCTA", "SmartLink", shared: false)]
        public ContentLink MoreinfoCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptimoveInstance", "Checklist", shared: true)]
        public string OptimoveInstance { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptinCTATitle", "Single-Line Text", shared: false)]
        public string OptinCTATitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptionalCTA", "SmartLink", shared: false)]
        public ContentLink OptionalCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayCTA", "Rich Text", shared: false)]
        public string OverlayCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverLayDescription", "Rich Text", shared: false)]
        public string OverLayDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayHeaderType", "Droplist", shared: false)]
        public string OverlayHeaderType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImage", "Image", shared: true)]
        public ContentImage OverlayImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageIntroductoryText", "Single-Line Text", shared: false)]
        public string OverlayImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageSubtitleText", "Single-Line Text", shared: false)]
        public string OverlayImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTextAlignment", "Droplist", shared: false)]
        public string OverlayImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTitleFontSize", "Droplist", shared: false)]
        public string OverlayImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTitleText", "Single-Line Text", shared: false)]
        public string OverlayImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayLayout", "Droptree", shared: true)]
        public DocumentId OverlayLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayManualTermsAndConditions", "Rich Text", shared: false)]
        public string OverlayManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayTitle", "Single-Line Text", shared: false)]
        public string OverlayTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceCTA", "SmartLink", shared: false)]
        public ContentLink PostAcceptanceCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceDescription", "Rich Text", shared: false)]
        public string PostAcceptanceDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceHeaderTitle", "Single-Line Text", shared: false)]
        public string PostAcceptanceHeaderTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImage", "Image", shared: true)]
        public ContentImage PostAcceptanceImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageIntroductoryText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageSubtitleText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTextAlignment", "Droplist", shared: false)]
        public string PostAcceptanceImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTitleFontSize", "Droplist", shared: false)]
        public string PostAcceptanceImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTitleText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceTitle", "Single-Line Text", shared: false)]
        public string PostAcceptanceTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceCTA1", "SmartLink", shared: false)]
        public ContentLink PreAcceptanceCTA1 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceCTA2", "SmartLink", shared: false)]
        public ContentLink PreAcceptanceCTA2 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceDescription", "Rich Text", shared: false)]
        public string PreAcceptanceDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceHeaderTitle", "Single-Line Text", shared: false)]
        public string PreAcceptanceHeaderTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImage", "Image", shared: true)]
        public ContentImage PreAcceptanceImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageIntroductoryText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageSubtitleText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTextAlignment", "Droplist", shared: false)]
        public string PreAcceptanceImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTitleFontSize", "Droplist", shared: false)]
        public string PreAcceptanceImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTitleText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceKeyTerms", "Rich Text", shared: false)]
        public string PreAcceptanceKeyTerms { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceTitle", "Single-Line Text", shared: false)]
        public string PreAcceptanceTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsBackgroundImage", "Image", shared: true)]
        public ContentImage PromoDetailsBackgroundImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsDescription", "Rich Text", shared: false)]
        public string PromoDetailsDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsHeroImage", "Image", shared: true)]
        public ContentImage PromoDetailsHeroImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsTitle", "Single-Line Text", shared: false)]
        public string PromoDetailsTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RestrictedOverlay", "Checkbox", shared: false)]
        public bool RestrictedOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RewardsOverlayLayout", "Droptree", shared: true)]
        public DocumentId RewardsOverlayLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShortImage", "Image", shared: true)]
        public ContentImage ShortImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShowManualTermsAndConditions", "Checkbox", shared: true)]
        public bool ShowManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShowManualTermsAndConditionsOnOverlay", "Checkbox", shared: true)]
        public bool ShowManualTermsAndConditionsOnOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SMSText", "Multi-Line Text", shared: false)]
        public string SMSText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnippetCallToAction", "Rich Text", shared: false)]
        public string SnippetCallToAction { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnippetDescription", "Rich Text", shared: false)]
        public string SnippetDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnippetTitle", "Single-Line Text", shared: false)]
        public string SnippetTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCloseCTALabel", "Single-Line Text", shared: false)]
        public string ToasterCloseCTALabel { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCloseWithTimer", "Checkbox", shared: true)]
        public bool ToasterCloseWithTimer { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCTA", "Rich Text", shared: false)]
        public string ToasterCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterDescription", "Rich Text", shared: false)]
        public string ToasterDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterLayout", "Droptree", shared: true)]
        public DocumentId ToasterLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterPrimaryGhostCTA", "Rich Text", shared: false)]
        public string ToasterPrimaryGhostCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterTitle", "Single-Line Text", shared: false)]
        public string ToasterTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TosterImage", "Image", shared: true)]
        public ContentImage TosterImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("UseRewardsOverlay", "Checkbox", shared: true)]
        public bool UseRewardsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ValidUpTo", "Datetime", shared: true)]
        public UtcDateTime ValidUpTo { get; }

        public CampaignAssetsDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BackgroundBannerImage = GetValue<ContentImage>("BackgroundBannerImage");
            BannerDescription = GetValue<string>("BannerDescription");
            BannerKeyTerms = GetValue<string>("BannerKeyTerms");
            BannerTitle = GetValue<string>("BannerTitle");
            CommonCTA = GetValue<ContentLink>("CommonCTA");
            CommonCTAPreview = GetValue<ContentLink>("CommonCTAPreview");
            CommonDescription = GetValue<string>("CommonDescription");
            CommonDescriptionPreview = GetValue<string>("CommonDescriptionPreview");
            CommonImageLandscape = GetValue<ContentImage>("CommonImageLandscape");
            CommonImageSquare = GetValue<ContentImage>("CommonImageSquare");
            CommonTermsAndConditions = GetValue<string>("CommonTermsAndConditions");
            CommonTitle = GetValue<string>("CommonTitle");
            CommonTitlePreview = GetValue<string>("CommonTitlePreview");
            CTANativeLink = GetValue<ContentLink>("CTANativeLink");
            CtaPosition1 = GetValue<string>("ctaPosition1");
            DetailCallToAction = GetValue<string>("DetailCallToAction");
            DetailDescription = GetValue<string>("DetailDescription");
            DetailImage = GetValue<ContentImage>("DetailImage");
            DetailsTermsAndConditions = GetValue<string>("DetailsTermsAndConditions");
            DetailTitle = GetValue<string>("DetailTitle");
            EligibilityCriteriaInfo = GetValue<string>("EligibilityCriteriaInfo");
            EmailCTA = GetValue<ContentLink>("EmailCTA");
            EmailImage = GetValue<ContentImage>("EmailImage");
            EmailSubject = GetValue<string>("EmailSubject");
            EmailText = GetValue<string>("EmailText");
            EmailTitle = GetValue<string>("EmailTitle");
            ExpandTermsAndConditionsByDefault = GetValue<bool>("ExpandTermsAndConditionsByDefault");
            HeaderTermsAndConditionsInbox = GetValue<string>("HeaderTermsAndConditionsInbox");
            HeaderTermsAndConditionsOverlay = GetValue<string>("HeaderTermsAndConditionsOverlay");
            HeaderTermsAndConditionsRewardsOverlay = GetValue<string>("HeaderTermsAndConditionsRewardsOverlay");
            HeaderTermsAndConditionsToaster = GetValue<string>("HeaderTermsAndConditionsToaster");
            HeroBannerImage = GetValue<ContentImage>("HeroBannerImage");
            ImageLink = GetValue<ContentLink>("ImageLink");
            InboxImageIntroductoryText = GetValue<string>("InboxImageIntroductoryText");
            InboxImageSubtitleText = GetValue<string>("InboxImageSubtitleText");
            InboxImageTextAlignment = GetValue<string>("InboxImageTextAlignment");
            InboxImageTitleFontSize = GetValue<string>("InboxImageTitleFontSize");
            InboxImageTitleText = GetValue<string>("InboxImageTitleText");
            InboxLayout = GetValue<DocumentId>("InboxLayout");
            ManualTermsAndConditions = GetValue<string>("ManualTermsAndConditions");
            MarketTypes = GetValue<string>("MarketTypes");
            MoreinfoCTA = GetValue<ContentLink>("MoreinfoCTA");
            OptimoveInstance = GetValue<string>("OptimoveInstance");
            OptinCTATitle = GetValue<string>("OptinCTATitle");
            OptionalCTA = GetValue<ContentLink>("OptionalCTA");
            OverlayCTA = GetValue<string>("OverlayCTA");
            OverLayDescription = GetValue<string>("OverLayDescription");
            OverlayHeaderType = GetValue<string>("OverlayHeaderType");
            OverlayImage = GetValue<ContentImage>("OverlayImage");
            OverlayImageIntroductoryText = GetValue<string>("OverlayImageIntroductoryText");
            OverlayImageSubtitleText = GetValue<string>("OverlayImageSubtitleText");
            OverlayImageTextAlignment = GetValue<string>("OverlayImageTextAlignment");
            OverlayImageTitleFontSize = GetValue<string>("OverlayImageTitleFontSize");
            OverlayImageTitleText = GetValue<string>("OverlayImageTitleText");
            OverlayLayout = GetValue<DocumentId>("OverlayLayout");
            OverlayManualTermsAndConditions = GetValue<string>("OverlayManualTermsAndConditions");
            OverlayTitle = GetValue<string>("OverlayTitle");
            PostAcceptanceCTA = GetValue<ContentLink>("PostAcceptanceCTA");
            PostAcceptanceDescription = GetValue<string>("PostAcceptanceDescription");
            PostAcceptanceHeaderTitle = GetValue<string>("PostAcceptanceHeaderTitle");
            PostAcceptanceImage = GetValue<ContentImage>("PostAcceptanceImage");
            PostAcceptanceImageIntroductoryText = GetValue<string>("PostAcceptanceImageIntroductoryText");
            PostAcceptanceImageSubtitleText = GetValue<string>("PostAcceptanceImageSubtitleText");
            PostAcceptanceImageTextAlignment = GetValue<string>("PostAcceptanceImageTextAlignment");
            PostAcceptanceImageTitleFontSize = GetValue<string>("PostAcceptanceImageTitleFontSize");
            PostAcceptanceImageTitleText = GetValue<string>("PostAcceptanceImageTitleText");
            PostAcceptanceTitle = GetValue<string>("PostAcceptanceTitle");
            PreAcceptanceCTA1 = GetValue<ContentLink>("PreAcceptanceCTA1");
            PreAcceptanceCTA2 = GetValue<ContentLink>("PreAcceptanceCTA2");
            PreAcceptanceDescription = GetValue<string>("PreAcceptanceDescription");
            PreAcceptanceHeaderTitle = GetValue<string>("PreAcceptanceHeaderTitle");
            PreAcceptanceImage = GetValue<ContentImage>("PreAcceptanceImage");
            PreAcceptanceImageIntroductoryText = GetValue<string>("PreAcceptanceImageIntroductoryText");
            PreAcceptanceImageSubtitleText = GetValue<string>("PreAcceptanceImageSubtitleText");
            PreAcceptanceImageTextAlignment = GetValue<string>("PreAcceptanceImageTextAlignment");
            PreAcceptanceImageTitleFontSize = GetValue<string>("PreAcceptanceImageTitleFontSize");
            PreAcceptanceImageTitleText = GetValue<string>("PreAcceptanceImageTitleText");
            PreAcceptanceKeyTerms = GetValue<string>("PreAcceptanceKeyTerms");
            PreAcceptanceTitle = GetValue<string>("PreAcceptanceTitle");
            PromoDetailsBackgroundImage = GetValue<ContentImage>("PromoDetailsBackgroundImage");
            PromoDetailsDescription = GetValue<string>("PromoDetailsDescription");
            PromoDetailsHeroImage = GetValue<ContentImage>("PromoDetailsHeroImage");
            PromoDetailsTitle = GetValue<string>("PromoDetailsTitle");
            RestrictedOverlay = GetValue<bool>("RestrictedOverlay");
            RewardsOverlayLayout = GetValue<DocumentId>("RewardsOverlayLayout");
            ShortImage = GetValue<ContentImage>("ShortImage");
            ShowManualTermsAndConditions = GetValue<bool>("ShowManualTermsAndConditions");
            ShowManualTermsAndConditionsOnOverlay = GetValue<bool>("ShowManualTermsAndConditionsOnOverlay");
            SMSText = GetValue<string>("SMSText");
            SnippetCallToAction = GetValue<string>("SnippetCallToAction");
            SnippetDescription = GetValue<string>("SnippetDescription");
            SnippetTitle = GetValue<string>("SnippetTitle");
            ToasterCloseCTALabel = GetValue<string>("ToasterCloseCTALabel");
            ToasterCloseWithTimer = GetValue<bool>("ToasterCloseWithTimer");
            ToasterCTA = GetValue<string>("ToasterCTA");
            ToasterDescription = GetValue<string>("ToasterDescription");
            ToasterLayout = GetValue<DocumentId>("ToasterLayout");
            ToasterPrimaryGhostCTA = GetValue<string>("ToasterPrimaryGhostCTA");
            ToasterTitle = GetValue<string>("ToasterTitle");
            TosterImage = GetValue<ContentImage>("TosterImage");
            UseRewardsOverlay = GetValue<bool>("UseRewardsOverlay");
            ValidUpTo = GetValue<UtcDateTime>("ValidUpTo");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CampaignPromoEmail", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class CampaignPromoEmailDocument : Frontend.Vanilla.Content.Document,ICampaignPromoEmail
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ctaPosition1", "Single-Line Text", shared: false)]
        public string CtaPosition1 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailCTA", "SmartLink", shared: false)]
        public ContentLink EmailCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailImage", "Image", shared: true)]
        public ContentImage EmailImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailSubject", "Single-Line Text", shared: false)]
        public string EmailSubject { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailText", "Rich Text", shared: false)]
        public string EmailText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EmailTitle", "Single-Line Text", shared: false)]
        public string EmailTitle { get; }

        public CampaignPromoEmailDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CtaPosition1 = GetValue<string>("ctaPosition1");
            EmailCTA = GetValue<ContentLink>("EmailCTA");
            EmailImage = GetValue<ContentImage>("EmailImage");
            EmailSubject = GetValue<string>("EmailSubject");
            EmailText = GetValue<string>("EmailText");
            EmailTitle = GetValue<string>("EmailTitle");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CampaignSMS", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class CampaignSMSDocument : Frontend.Vanilla.Content.Document,ICampaignSMS
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SMSText", "Multi-Line Text", shared: false)]
        public string SMSText { get; }

        public CampaignSMSDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            SMSText = GetValue<string>("SMSText");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("CommonDetails", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class CommonDetailsDocument : Frontend.Vanilla.Content.Document,ICommonDetails
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Description", "Single-Line Text", shared: false)]
        public string Description { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        public CommonDetailsDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Description = GetValue<string>("Description");
            Title = GetValue<string>("Title");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("EligibiltyCriteria", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class EligibiltyCriteriaDocument : Frontend.Vanilla.Content.Document,IEligibiltyCriteria
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EligibilityCriteriaInfo", "Rich Text", shared: false)]
        public string EligibilityCriteriaInfo { get; }

        public EligibiltyCriteriaDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            EligibilityCriteriaInfo = GetValue<string>("EligibilityCriteriaInfo");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Filter Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class FilterTemplateDocument : Frontend.Vanilla.Content.Document,IFilterTemplate
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        public FilterTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Folder", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class FolderDocument : Frontend.Vanilla.Content.Document,IFolder
    {
        public FolderDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Form Element Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class FormElementTemplateDocument : Frontend.Vanilla.Content.Document,IFormElementTemplate
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HtmlAttributes", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters HtmlAttributes { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Label", "Single-Line Text", shared: false)]
        public string Label { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Validation", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Validation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Values", "Bwin Name Value List Unsorted", shared: false)]
        public IReadOnlyList<ListItem> Values { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Watermark", "Single-Line Text", shared: false)]
        public string Watermark { get; }

        public FormElementTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            HtmlAttributes = GetValue<ContentParameters>("HtmlAttributes");
            Label = GetValue<string>("Label");
            ToolTip = GetValue<string>("ToolTip");
            Validation = GetValue<ContentParameters>("Validation");
            Values = GetValue<IReadOnlyList<ListItem>>("Values");
            Watermark = GetValue<string>("Watermark");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GenericListItem", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GenericListItemDocument : Frontend.Vanilla.Content.Document,IGenericListItem
    {       
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SharedList", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters SharedList { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("VersionedList", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters VersionedList { get; }

        public GenericListItemDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {           
            SharedList = GetValue<ContentParameters>("SharedList");
            VersionedList = GetValue<ContentParameters>("VersionedList");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("InboxOffer", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class InboxOfferDocument : Frontend.Vanilla.Content.Document,IInboxOffer
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CTANativeLink", "SmartLink", shared: false)]
        public ContentLink CTANativeLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailCallToAction", "Rich Text", shared: false)]
        public string DetailCallToAction { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailDescription", "Rich Text", shared: false)]
        public string DetailDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailImage", "Image", shared: true)]
        public ContentImage DetailImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailTitle", "Single-Line Text", shared: false)]
        public string DetailTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ExpandTermsAndConditionsByDefault", "Checkbox", shared: true)]
        public bool ExpandTermsAndConditionsByDefault { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsInbox", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsInbox { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsOverlay", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsRewardsOverlay", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsRewardsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsToaster", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsToaster { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageLink", "SmartLink", shared: false)]
        public ContentLink ImageLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageIntroductoryText", "Single-Line Text", shared: false)]
        public string InboxImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageSubtitleText", "Single-Line Text", shared: false)]
        public string InboxImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageTextAlignment", "Droplist", shared: false)]
        public string InboxImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageTitleFontSize", "Droplist", shared: false)]
        public string InboxImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxImageTitleText", "Single-Line Text", shared: false)]
        public string InboxImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("InboxLayout", "Droptree", shared: true)]
        public DocumentId InboxLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ManualTermsAndConditions", "Rich Text", shared: false)]
        public string ManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptimoveInstance", "Checklist", shared: true)]
        public string OptimoveInstance { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayCTA", "Rich Text", shared: false)]
        public string OverlayCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverLayDescription", "Rich Text", shared: false)]
        public string OverLayDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayHeaderType", "Droplist", shared: false)]
        public string OverlayHeaderType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImage", "Image", shared: true)]
        public ContentImage OverlayImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageIntroductoryText", "Single-Line Text", shared: false)]
        public string OverlayImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageSubtitleText", "Single-Line Text", shared: false)]
        public string OverlayImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTextAlignment", "Droplist", shared: false)]
        public string OverlayImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTitleFontSize", "Droplist", shared: false)]
        public string OverlayImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTitleText", "Single-Line Text", shared: false)]
        public string OverlayImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayLayout", "Droptree", shared: true)]
        public DocumentId OverlayLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayManualTermsAndConditions", "Rich Text", shared: false)]
        public string OverlayManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayTitle", "Single-Line Text", shared: false)]
        public string OverlayTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceCTA", "SmartLink", shared: false)]
        public ContentLink PostAcceptanceCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceDescription", "Rich Text", shared: false)]
        public string PostAcceptanceDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceHeaderTitle", "Single-Line Text", shared: false)]
        public string PostAcceptanceHeaderTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImage", "Image", shared: true)]
        public ContentImage PostAcceptanceImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageIntroductoryText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageSubtitleText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTextAlignment", "Droplist", shared: false)]
        public string PostAcceptanceImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTitleFontSize", "Droplist", shared: false)]
        public string PostAcceptanceImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTitleText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceTitle", "Single-Line Text", shared: false)]
        public string PostAcceptanceTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceCTA1", "SmartLink", shared: false)]
        public ContentLink PreAcceptanceCTA1 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceCTA2", "SmartLink", shared: false)]
        public ContentLink PreAcceptanceCTA2 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceDescription", "Rich Text", shared: false)]
        public string PreAcceptanceDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceHeaderTitle", "Single-Line Text", shared: false)]
        public string PreAcceptanceHeaderTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImage", "Image", shared: true)]
        public ContentImage PreAcceptanceImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageIntroductoryText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageSubtitleText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTextAlignment", "Droplist", shared: false)]
        public string PreAcceptanceImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTitleFontSize", "Droplist", shared: false)]
        public string PreAcceptanceImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTitleText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceKeyTerms", "Rich Text", shared: false)]
        public string PreAcceptanceKeyTerms { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceTitle", "Single-Line Text", shared: false)]
        public string PreAcceptanceTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RestrictedOverlay", "Checkbox", shared: false)]
        public bool RestrictedOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RewardsOverlayLayout", "Droptree", shared: true)]
        public DocumentId RewardsOverlayLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShortImage", "Image", shared: true)]
        public ContentImage ShortImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShowManualTermsAndConditions", "Checkbox", shared: true)]
        public bool ShowManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShowManualTermsAndConditionsOnOverlay", "Checkbox", shared: true)]
        public bool ShowManualTermsAndConditionsOnOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnippetCallToAction", "Rich Text", shared: false)]
        public string SnippetCallToAction { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnippetDescription", "Rich Text", shared: false)]
        public string SnippetDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnippetTitle", "Single-Line Text", shared: false)]
        public string SnippetTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCloseCTALabel", "Single-Line Text", shared: false)]
        public string ToasterCloseCTALabel { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCloseWithTimer", "Checkbox", shared: true)]
        public bool ToasterCloseWithTimer { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCTA", "Rich Text", shared: false)]
        public string ToasterCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterDescription", "Rich Text", shared: false)]
        public string ToasterDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterLayout", "Droptree", shared: true)]
        public DocumentId ToasterLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterPrimaryGhostCTA", "Rich Text", shared: false)]
        public string ToasterPrimaryGhostCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterTitle", "Single-Line Text", shared: false)]
        public string ToasterTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TosterImage", "Image", shared: true)]
        public ContentImage TosterImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("UseRewardsOverlay", "Checkbox", shared: true)]
        public bool UseRewardsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ValidUpTo", "Datetime", shared: true)]
        public UtcDateTime ValidUpTo { get; }

        public InboxOfferDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CTANativeLink = GetValue<ContentLink>("CTANativeLink");
            DetailCallToAction = GetValue<string>("DetailCallToAction");
            DetailDescription = GetValue<string>("DetailDescription");
            DetailImage = GetValue<ContentImage>("DetailImage");
            DetailTitle = GetValue<string>("DetailTitle");
            ExpandTermsAndConditionsByDefault = GetValue<bool>("ExpandTermsAndConditionsByDefault");
            HeaderTermsAndConditionsInbox = GetValue<string>("HeaderTermsAndConditionsInbox");
            HeaderTermsAndConditionsOverlay = GetValue<string>("HeaderTermsAndConditionsOverlay");
            HeaderTermsAndConditionsRewardsOverlay = GetValue<string>("HeaderTermsAndConditionsRewardsOverlay");
            HeaderTermsAndConditionsToaster = GetValue<string>("HeaderTermsAndConditionsToaster");
            ImageLink = GetValue<ContentLink>("ImageLink");
            InboxImageIntroductoryText = GetValue<string>("InboxImageIntroductoryText");
            InboxImageSubtitleText = GetValue<string>("InboxImageSubtitleText");
            InboxImageTextAlignment = GetValue<string>("InboxImageTextAlignment");
            InboxImageTitleFontSize = GetValue<string>("InboxImageTitleFontSize");
            InboxImageTitleText = GetValue<string>("InboxImageTitleText");
            InboxLayout = GetValue<DocumentId>("InboxLayout");
            ManualTermsAndConditions = GetValue<string>("ManualTermsAndConditions");
            OptimoveInstance = GetValue<string>("OptimoveInstance");
            OverlayCTA = GetValue<string>("OverlayCTA");
            OverLayDescription = GetValue<string>("OverLayDescription");
            OverlayHeaderType = GetValue<string>("OverlayHeaderType");
            OverlayImage = GetValue<ContentImage>("OverlayImage");
            OverlayImageIntroductoryText = GetValue<string>("OverlayImageIntroductoryText");
            OverlayImageSubtitleText = GetValue<string>("OverlayImageSubtitleText");
            OverlayImageTextAlignment = GetValue<string>("OverlayImageTextAlignment");
            OverlayImageTitleFontSize = GetValue<string>("OverlayImageTitleFontSize");
            OverlayImageTitleText = GetValue<string>("OverlayImageTitleText");
            OverlayLayout = GetValue<DocumentId>("OverlayLayout");
            OverlayManualTermsAndConditions = GetValue<string>("OverlayManualTermsAndConditions");
            OverlayTitle = GetValue<string>("OverlayTitle");
            PostAcceptanceCTA = GetValue<ContentLink>("PostAcceptanceCTA");
            PostAcceptanceDescription = GetValue<string>("PostAcceptanceDescription");
            PostAcceptanceHeaderTitle = GetValue<string>("PostAcceptanceHeaderTitle");
            PostAcceptanceImage = GetValue<ContentImage>("PostAcceptanceImage");
            PostAcceptanceImageIntroductoryText = GetValue<string>("PostAcceptanceImageIntroductoryText");
            PostAcceptanceImageSubtitleText = GetValue<string>("PostAcceptanceImageSubtitleText");
            PostAcceptanceImageTextAlignment = GetValue<string>("PostAcceptanceImageTextAlignment");
            PostAcceptanceImageTitleFontSize = GetValue<string>("PostAcceptanceImageTitleFontSize");
            PostAcceptanceImageTitleText = GetValue<string>("PostAcceptanceImageTitleText");
            PostAcceptanceTitle = GetValue<string>("PostAcceptanceTitle");
            PreAcceptanceCTA1 = GetValue<ContentLink>("PreAcceptanceCTA1");
            PreAcceptanceCTA2 = GetValue<ContentLink>("PreAcceptanceCTA2");
            PreAcceptanceDescription = GetValue<string>("PreAcceptanceDescription");
            PreAcceptanceHeaderTitle = GetValue<string>("PreAcceptanceHeaderTitle");
            PreAcceptanceImage = GetValue<ContentImage>("PreAcceptanceImage");
            PreAcceptanceImageIntroductoryText = GetValue<string>("PreAcceptanceImageIntroductoryText");
            PreAcceptanceImageSubtitleText = GetValue<string>("PreAcceptanceImageSubtitleText");
            PreAcceptanceImageTextAlignment = GetValue<string>("PreAcceptanceImageTextAlignment");
            PreAcceptanceImageTitleFontSize = GetValue<string>("PreAcceptanceImageTitleFontSize");
            PreAcceptanceImageTitleText = GetValue<string>("PreAcceptanceImageTitleText");
            PreAcceptanceKeyTerms = GetValue<string>("PreAcceptanceKeyTerms");
            PreAcceptanceTitle = GetValue<string>("PreAcceptanceTitle");
            RestrictedOverlay = GetValue<bool>("RestrictedOverlay");
            RewardsOverlayLayout = GetValue<DocumentId>("RewardsOverlayLayout");
            ShortImage = GetValue<ContentImage>("ShortImage");
            ShowManualTermsAndConditions = GetValue<bool>("ShowManualTermsAndConditions");
            ShowManualTermsAndConditionsOnOverlay = GetValue<bool>("ShowManualTermsAndConditionsOnOverlay");
            SnippetCallToAction = GetValue<string>("SnippetCallToAction");
            SnippetDescription = GetValue<string>("SnippetDescription");
            SnippetTitle = GetValue<string>("SnippetTitle");
            ToasterCloseCTALabel = GetValue<string>("ToasterCloseCTALabel");
            ToasterCloseWithTimer = GetValue<bool>("ToasterCloseWithTimer");
            ToasterCTA = GetValue<string>("ToasterCTA");
            ToasterDescription = GetValue<string>("ToasterDescription");
            ToasterLayout = GetValue<DocumentId>("ToasterLayout");
            ToasterPrimaryGhostCTA = GetValue<string>("ToasterPrimaryGhostCTA");
            ToasterTitle = GetValue<string>("ToasterTitle");
            TosterImage = GetValue<ContentImage>("TosterImage");
            UseRewardsOverlay = GetValue<bool>("UseRewardsOverlay");
            ValidUpTo = GetValue<UtcDateTime>("ValidUpTo");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Json", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class JsonDocument : Frontend.Vanilla.Content.Document,IJson
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Json", "Json", shared: true)]
        public string Json { get; }

        public JsonDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            Json = GetValue<string>("Json");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LinkTemplate", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class LinkTemplateDocument : Frontend.Vanilla.Content.Document,ILinkTemplate
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FrameTarget", "Single-Line Text", shared: true)]
        public string FrameTarget { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HtmlAttributes", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters HtmlAttributes { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Link", "SmartLink", shared: false)]
        public ContentLink Link { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("LinkText", "Single-Line Text", shared: false)]
        public string LinkText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Name", "Single-Line Text", shared: true)]
        public string Name { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("NoFollow", "Checkbox", shared: true)]
        public bool NoFollow { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Url", "Single-Line Text", shared: true)]
        public Uri Url { get; }

        public LinkTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            FrameTarget = GetValue<string>("FrameTarget");
            HtmlAttributes = GetValue<ContentParameters>("HtmlAttributes");
            Link = GetValue<ContentLink>("Link");
            LinkText = GetValue<string>("LinkText");
            Name = GetValue<string>("Name");
            NoFollow = GetValue<bool>("NoFollow");
            ToolTip = GetValue<string>("ToolTip");
            Url = GetValue<Uri>("Url");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Menu Item Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class MenuItemTemplateDocument : Frontend.Vanilla.Content.Document,IMenuItemTemplate
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HtmlAttributes", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters HtmlAttributes { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("LinkReference", "BwinLink", shared: true)]
        public ContentLink LinkReference { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("LinkText", "Single-Line Text", shared: false)]
        public string LinkText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SubNavigationContainer", "Rich Text", shared: false)]
        public string SubNavigationContainer { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("WebAnalytics", "Multi-Line Text", shared: false)]
        public string WebAnalytics { get; }

        public MenuItemTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            HtmlAttributes = GetValue<ContentParameters>("HtmlAttributes");
            Image = GetValue<ContentImage>("Image");
            LinkReference = GetValue<ContentLink>("LinkReference");
            LinkText = GetValue<string>("LinkText");
            SubNavigationContainer = GetValue<string>("SubNavigationContainer");
            ToolTip = GetValue<string>("ToolTip");
            WebAnalytics = GetValue<string>("WebAnalytics");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MenuItem", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class MenuItemDocument : Frontend.Vanilla.Content.Document,IMenuItem
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CssClass", "Single-Line Text", shared: false)]
        public string CssClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CustomAnimation", "Single-Line Text", shared: false)]
        public string CustomAnimation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DefaultAnimation", "Checkbox", shared: false)]
        public bool DefaultAnimation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Link", "BwinLink", shared: true)]
        public ContentLink Link { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Resources", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Resources { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Size", "Droplist", shared: false)]
        public string Size { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SvgImage", "Image", shared: true)]
        public ContentImage SvgImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Text", "Single-Line Text", shared: false)]
        public string Text { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Type", "Droplist", shared: false)]
        public string Type { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ViewBox", "Single-Line Text", shared: false)]
        public string ViewBox { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("WebAnalytics", "Multi-Line Text", shared: false)]
        public string WebAnalytics { get; }

        public MenuItemDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            CssClass = GetValue<string>("CssClass");
            CustomAnimation = GetValue<string>("CustomAnimation");
            DefaultAnimation = GetValue<bool>("DefaultAnimation");
            Image = GetValue<ContentImage>("Image");
            Link = GetValue<ContentLink>("Link");
            Parameters = GetValue<ContentParameters>("Parameters");
            Resources = GetValue<ContentParameters>("Resources");
            Size = GetValue<string>("Size");
            SvgImage = GetValue<ContentImage>("SvgImage");
            Text = GetValue<string>("Text");
            ToolTip = GetValue<string>("ToolTip");
            Type = GetValue<string>("Type");
            ViewBox = GetValue<string>("ViewBox");
            WebAnalytics = GetValue<string>("WebAnalytics");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MenuItemStatic", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class MenuItemStaticDocument : Frontend.Vanilla.Content.Document,IMenuItemStatic
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CssClass", "Single-Line Text", shared: false)]
        public string CssClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CustomAnimation", "Single-Line Text", shared: false)]
        public string CustomAnimation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DefaultAnimation", "Checkbox", shared: false)]
        public bool DefaultAnimation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Link", "BwinLink", shared: true)]
        public ContentLink Link { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Resources", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Resources { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Size", "Droplist", shared: false)]
        public string Size { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SvgImage", "Image", shared: true)]
        public ContentImage SvgImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Text", "Single-Line Text", shared: false)]
        public string Text { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Type", "Droplist", shared: false)]
        public string Type { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ViewBox", "Single-Line Text", shared: false)]
        public string ViewBox { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("WebAnalytics", "Multi-Line Text", shared: false)]
        public string WebAnalytics { get; }

        public MenuItemStaticDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            CssClass = GetValue<string>("CssClass");
            CustomAnimation = GetValue<string>("CustomAnimation");
            DefaultAnimation = GetValue<bool>("DefaultAnimation");
            Image = GetValue<ContentImage>("Image");
            Link = GetValue<ContentLink>("Link");
            Parameters = GetValue<ContentParameters>("Parameters");
            Resources = GetValue<ContentParameters>("Resources");
            Size = GetValue<string>("Size");
            SvgImage = GetValue<ContentImage>("SvgImage");
            Text = GetValue<string>("Text");
            ToolTip = GetValue<string>("ToolTip");
            Type = GetValue<string>("Type");
            ViewBox = GetValue<string>("ViewBox");
            WebAnalytics = GetValue<string>("WebAnalytics");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Notification", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class NotificationDocument : Frontend.Vanilla.Content.Document,INotification
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CTANativeLink", "SmartLink", shared: false)]
        public ContentLink CTANativeLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsOverlay", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsRewardsOverlay", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsRewardsOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeaderTermsAndConditionsToaster", "Single-Line Text", shared: false)]
        public string HeaderTermsAndConditionsToaster { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayCTA", "Rich Text", shared: false)]
        public string OverlayCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverLayDescription", "Rich Text", shared: false)]
        public string OverLayDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayHeaderType", "Droplist", shared: false)]
        public string OverlayHeaderType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImage", "Image", shared: true)]
        public ContentImage OverlayImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageIntroductoryText", "Single-Line Text", shared: false)]
        public string OverlayImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageSubtitleText", "Single-Line Text", shared: false)]
        public string OverlayImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTextAlignment", "Droplist", shared: false)]
        public string OverlayImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTitleFontSize", "Droplist", shared: false)]
        public string OverlayImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayImageTitleText", "Single-Line Text", shared: false)]
        public string OverlayImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayLayout", "Droptree", shared: true)]
        public DocumentId OverlayLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayManualTermsAndConditions", "Rich Text", shared: false)]
        public string OverlayManualTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OverlayTitle", "Single-Line Text", shared: false)]
        public string OverlayTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceCTA", "SmartLink", shared: false)]
        public ContentLink PostAcceptanceCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceDescription", "Rich Text", shared: false)]
        public string PostAcceptanceDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceHeaderTitle", "Single-Line Text", shared: false)]
        public string PostAcceptanceHeaderTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImage", "Image", shared: true)]
        public ContentImage PostAcceptanceImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageIntroductoryText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageSubtitleText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTextAlignment", "Droplist", shared: false)]
        public string PostAcceptanceImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTitleFontSize", "Droplist", shared: false)]
        public string PostAcceptanceImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceImageTitleText", "Single-Line Text", shared: false)]
        public string PostAcceptanceImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PostAcceptanceTitle", "Single-Line Text", shared: false)]
        public string PostAcceptanceTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceCTA1", "SmartLink", shared: false)]
        public ContentLink PreAcceptanceCTA1 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceCTA2", "SmartLink", shared: false)]
        public ContentLink PreAcceptanceCTA2 { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceDescription", "Rich Text", shared: false)]
        public string PreAcceptanceDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceHeaderTitle", "Single-Line Text", shared: false)]
        public string PreAcceptanceHeaderTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImage", "Image", shared: true)]
        public ContentImage PreAcceptanceImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageIntroductoryText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageIntroductoryText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageSubtitleText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageSubtitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTextAlignment", "Droplist", shared: false)]
        public string PreAcceptanceImageTextAlignment { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTitleFontSize", "Droplist", shared: false)]
        public string PreAcceptanceImageTitleFontSize { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceImageTitleText", "Single-Line Text", shared: false)]
        public string PreAcceptanceImageTitleText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceKeyTerms", "Rich Text", shared: false)]
        public string PreAcceptanceKeyTerms { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PreAcceptanceTitle", "Single-Line Text", shared: false)]
        public string PreAcceptanceTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RestrictedOverlay", "Checkbox", shared: false)]
        public bool RestrictedOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RewardsOverlayLayout", "Droptree", shared: true)]
        public DocumentId RewardsOverlayLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ShowManualTermsAndConditionsOnOverlay", "Checkbox", shared: true)]
        public bool ShowManualTermsAndConditionsOnOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCloseCTALabel", "Single-Line Text", shared: false)]
        public string ToasterCloseCTALabel { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCloseWithTimer", "Checkbox", shared: true)]
        public bool ToasterCloseWithTimer { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterCTA", "Rich Text", shared: false)]
        public string ToasterCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterDescription", "Rich Text", shared: false)]
        public string ToasterDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterLayout", "Droptree", shared: true)]
        public DocumentId ToasterLayout { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterPrimaryGhostCTA", "Rich Text", shared: false)]
        public string ToasterPrimaryGhostCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToasterTitle", "Single-Line Text", shared: false)]
        public string ToasterTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TosterImage", "Image", shared: true)]
        public ContentImage TosterImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("UseRewardsOverlay", "Checkbox", shared: true)]
        public bool UseRewardsOverlay { get; }

        public NotificationDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CTANativeLink = GetValue<ContentLink>("CTANativeLink");
            HeaderTermsAndConditionsOverlay = GetValue<string>("HeaderTermsAndConditionsOverlay");
            HeaderTermsAndConditionsRewardsOverlay = GetValue<string>("HeaderTermsAndConditionsRewardsOverlay");
            HeaderTermsAndConditionsToaster = GetValue<string>("HeaderTermsAndConditionsToaster");
            OverlayCTA = GetValue<string>("OverlayCTA");
            OverLayDescription = GetValue<string>("OverLayDescription");
            OverlayHeaderType = GetValue<string>("OverlayHeaderType");
            OverlayImage = GetValue<ContentImage>("OverlayImage");
            OverlayImageIntroductoryText = GetValue<string>("OverlayImageIntroductoryText");
            OverlayImageSubtitleText = GetValue<string>("OverlayImageSubtitleText");
            OverlayImageTextAlignment = GetValue<string>("OverlayImageTextAlignment");
            OverlayImageTitleFontSize = GetValue<string>("OverlayImageTitleFontSize");
            OverlayImageTitleText = GetValue<string>("OverlayImageTitleText");
            OverlayLayout = GetValue<DocumentId>("OverlayLayout");
            OverlayManualTermsAndConditions = GetValue<string>("OverlayManualTermsAndConditions");
            OverlayTitle = GetValue<string>("OverlayTitle");
            PostAcceptanceCTA = GetValue<ContentLink>("PostAcceptanceCTA");
            PostAcceptanceDescription = GetValue<string>("PostAcceptanceDescription");
            PostAcceptanceHeaderTitle = GetValue<string>("PostAcceptanceHeaderTitle");
            PostAcceptanceImage = GetValue<ContentImage>("PostAcceptanceImage");
            PostAcceptanceImageIntroductoryText = GetValue<string>("PostAcceptanceImageIntroductoryText");
            PostAcceptanceImageSubtitleText = GetValue<string>("PostAcceptanceImageSubtitleText");
            PostAcceptanceImageTextAlignment = GetValue<string>("PostAcceptanceImageTextAlignment");
            PostAcceptanceImageTitleFontSize = GetValue<string>("PostAcceptanceImageTitleFontSize");
            PostAcceptanceImageTitleText = GetValue<string>("PostAcceptanceImageTitleText");
            PostAcceptanceTitle = GetValue<string>("PostAcceptanceTitle");
            PreAcceptanceCTA1 = GetValue<ContentLink>("PreAcceptanceCTA1");
            PreAcceptanceCTA2 = GetValue<ContentLink>("PreAcceptanceCTA2");
            PreAcceptanceDescription = GetValue<string>("PreAcceptanceDescription");
            PreAcceptanceHeaderTitle = GetValue<string>("PreAcceptanceHeaderTitle");
            PreAcceptanceImage = GetValue<ContentImage>("PreAcceptanceImage");
            PreAcceptanceImageIntroductoryText = GetValue<string>("PreAcceptanceImageIntroductoryText");
            PreAcceptanceImageSubtitleText = GetValue<string>("PreAcceptanceImageSubtitleText");
            PreAcceptanceImageTextAlignment = GetValue<string>("PreAcceptanceImageTextAlignment");
            PreAcceptanceImageTitleFontSize = GetValue<string>("PreAcceptanceImageTitleFontSize");
            PreAcceptanceImageTitleText = GetValue<string>("PreAcceptanceImageTitleText");
            PreAcceptanceKeyTerms = GetValue<string>("PreAcceptanceKeyTerms");
            PreAcceptanceTitle = GetValue<string>("PreAcceptanceTitle");
            RestrictedOverlay = GetValue<bool>("RestrictedOverlay");
            RewardsOverlayLayout = GetValue<DocumentId>("RewardsOverlayLayout");
            ShowManualTermsAndConditionsOnOverlay = GetValue<bool>("ShowManualTermsAndConditionsOnOverlay");
            ToasterCloseCTALabel = GetValue<string>("ToasterCloseCTALabel");
            ToasterCloseWithTimer = GetValue<bool>("ToasterCloseWithTimer");
            ToasterCTA = GetValue<string>("ToasterCTA");
            ToasterDescription = GetValue<string>("ToasterDescription");
            ToasterLayout = GetValue<DocumentId>("ToasterLayout");
            ToasterPrimaryGhostCTA = GetValue<string>("ToasterPrimaryGhostCTA");
            ToasterTitle = GetValue<string>("ToasterTitle");
            TosterImage = GetValue<ContentImage>("TosterImage");
            UseRewardsOverlay = GetValue<bool>("UseRewardsOverlay");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("OptimoveIntegration", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class OptimoveIntegrationDocument : Frontend.Vanilla.Content.Document,IOptimoveIntegration
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptimoveInstance", "Checklist", shared: true)]
        public string OptimoveInstance { get; }

        public OptimoveIntegrationDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            OptimoveInstance = GetValue<string>("OptimoveInstance");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PC Menu", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCMenuDocument : Frontend.Vanilla.Content.Document,IPCMenu
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Depth", "Integer", shared: false)]
        public int Depth { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HighlightParents", "Checkbox", shared: false)]
        public bool HighlightParents { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MenuNode", "Droptree", shared: true)]
        public DocumentId MenuNode { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCMenuDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Depth = GetValue<int>("Depth");
            HighlightParents = GetValue<bool>("HighlightParents");
            MenuNode = GetValue<DocumentId>("MenuNode");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PC Sandbox", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCSandboxDocument : Frontend.Vanilla.Content.Document,IPCSandbox
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FallbackContent", "Droptree", shared: true)]
        public DocumentId FallbackContent { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MaxResponseTime", "Integer", shared: true)]
        public int MaxResponseTime { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("WidgetUrl", "SmartLink", shared: false)]
        public ContentLink WidgetUrl { get; }

        public PCSandboxDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            FallbackContent = GetValue<DocumentId>("FallbackContent");
            MaxResponseTime = GetValue<int>("MaxResponseTime");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
            WidgetUrl = GetValue<ContentLink>("WidgetUrl");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PC Teaser", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCTeaserDocument : Frontend.Vanilla.Content.Document,IPCTeaser
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageLink", "SmartLink", shared: true)]
        public ContentLink ImageLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageOverlay", "Image", shared: true)]
        public ContentImage ImageOverlay { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageOverlayClass", "Single-Line Text", shared: true)]
        public string ImageOverlayClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptionalText", "Rich Text", shared: false)]
        public string OptionalText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Subtitle", "Single-Line Text", shared: false)]
        public string Subtitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Summary", "Multi-Line Text", shared: false)]
        public string Summary { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Text", "Rich Text", shared: false)]
        public string Text { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCTeaserDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Image = GetValue<ContentImage>("Image");
            ImageLink = GetValue<ContentLink>("ImageLink");
            ImageOverlay = GetValue<ContentImage>("ImageOverlay");
            ImageOverlayClass = GetValue<string>("ImageOverlayClass");
            OptionalText = GetValue<string>("OptionalText");
            Parameters = GetValue<ContentParameters>("Parameters");
            Subtitle = GetValue<string>("Subtitle");
            Summary = GetValue<string>("Summary");
            Text = GetValue<string>("Text");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCBaseComponent", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCBaseComponentDocument : Frontend.Vanilla.Content.Document,IPCBaseComponent
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCBaseComponentDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCCarousel", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCCarouselDocument : Frontend.Vanilla.Content.Document,IPCCarousel
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MaxItems", "Integer", shared: true)]
        public int MaxItems { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCCarouselDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            MaxItems = GetValue<int>("MaxItems");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCComponentFolder", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCComponentFolderDocument : Frontend.Vanilla.Content.Document,IPCComponentFolder
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MaxItems", "Integer", shared: true)]
        public int MaxItems { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCComponentFolderDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            MaxItems = GetValue<int>("MaxItems");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCContainer", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCContainerDocument : Frontend.Vanilla.Content.Document,IPCContainer
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Items", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Items { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCContainerDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Items = GetValue<IReadOnlyList<DocumentId>>("Items");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCFlash", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCFlashDocument : Frontend.Vanilla.Content.Document,IPCFlash
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BGColor", "Single-Line Text", shared: false)]
        public string BGColor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Flash", "File", shared: false)]
        public string Flash { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FlashVariables", "Name Value List", shared: false)]
        public string FlashVariables { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Height", "Integer", shared: false)]
        public int Height { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ReplacementImage", "Image", shared: false)]
        public ContentImage ReplacementImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ReplacementText", "Rich Text", shared: false)]
        public string ReplacementText { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Width", "Integer", shared: false)]
        public int Width { get; }

        public PCFlashDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BGColor = GetValue<string>("BGColor");
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Flash = GetValue<string>("Flash");
            FlashVariables = GetValue<string>("FlashVariables");
            Height = GetValue<int>("Height");
            Parameters = GetValue<ContentParameters>("Parameters");
            ReplacementImage = GetValue<ContentImage>("ReplacementImage");
            ReplacementText = GetValue<string>("ReplacementText");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
            Width = GetValue<int>("Width");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCIFrame", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCIFrameDocument : Frontend.Vanilla.Content.Document,IPCIFrame
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Height", "Integer", shared: false)]
        public int Height { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Src", "SmartLink", shared: false)]
        public ContentLink Src { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Width", "Integer", shared: false)]
        public int Width { get; }

        public PCIFrameDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Height = GetValue<int>("Height");
            Parameters = GetValue<ContentParameters>("Parameters");
            Src = GetValue<ContentLink>("Src");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
            Width = GetValue<int>("Width");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCImage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCImageDocument : Frontend.Vanilla.Content.Document,IPCImage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("IconName", "Single-Line Text", shared: false)]
        public string IconName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: false)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageLink", "SmartLink", shared: false)]
        public ContentLink ImageLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCImageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            IconName = GetValue<string>("IconName");
            Image = GetValue<ContentImage>("Image");
            ImageLink = GetValue<ContentLink>("ImageLink");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            ToolTip = GetValue<string>("ToolTip");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCImageText", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCImageTextDocument : Frontend.Vanilla.Content.Document,IPCImageText
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: false)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ImageLink", "SmartLink", shared: false)]
        public ContentLink ImageLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Text", "Rich Text", shared: false)]
        public string Text { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCImageTextDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Image = GetValue<ContentImage>("Image");
            ImageLink = GetValue<ContentLink>("ImageLink");
            Parameters = GetValue<ContentParameters>("Parameters");
            Text = GetValue<string>("Text");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCRawHtml", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCRawHtmlDocument : Frontend.Vanilla.Content.Document,IPCRawHtml
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Html", "Rich Text", shared: false)]
        public string Html { get; }

        public PCRawHtmlDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Html = GetValue<string>("Html");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCRegionalComponent", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCRegionalComponentDocument : Frontend.Vanilla.Content.Document,IPCRegionalComponent
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RegionItems", "Bwin Name Value List Unsorted", shared: true)]
        public IReadOnlyList<KeyValuePair<string,DocumentId>> RegionItems { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCRegionalComponentDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Parameters = GetValue<ContentParameters>("Parameters");
            RegionItems = GetValue<IReadOnlyList<KeyValuePair<string,DocumentId>>>("RegionItems");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCScript", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCScriptDocument : Frontend.Vanilla.Content.Document,IPCScript
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Code", "Rich Text", shared: true)]
        public string Code { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("IsFooter", "Checkbox", shared: true)]
        public bool IsFooter { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Reference", "General Link", shared: true)]
        public ContentLink Reference { get; }

        public PCScriptDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Code = GetValue<string>("Code");
            Condition = GetValue<string>("Condition");
            IsFooter = GetValue<bool>("IsFooter");
            Reference = GetValue<ContentLink>("Reference");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCScrollMenu", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCScrollMenuDocument : Frontend.Vanilla.Content.Document,IPCScrollMenu
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MenuItems", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> MenuItems { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCScrollMenuDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            MenuItems = GetValue<IReadOnlyList<DocumentId>>("MenuItems");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCStyle", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCStyleDocument : Frontend.Vanilla.Content.Document,IPCStyle
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CSS", "Rich Text", shared: true)]
        public string CSS { get; }

        public PCStyleDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CSS = GetValue<string>("CSS");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCText", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCTextDocument : Frontend.Vanilla.Content.Document,IPCText
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Text", "Rich Text", shared: false)]
        public string Text { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }       

        public PCTextDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Parameters = GetValue<ContentParameters>("Parameters");
            Text = GetValue<string>("Text");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");           
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCVideo", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCVideoDocument : Frontend.Vanilla.Content.Document,IPCVideo
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Controls", "Checkbox", shared: false)]
        public bool Controls { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Video", "BwinVideo", shared: false)]
        public ContentVideo Video { get; }

        public PCVideoDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Controls = GetValue<bool>("Controls");
            Parameters = GetValue<ContentParameters>("Parameters");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
            Video = GetValue<ContentVideo>("Video");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PCWidget", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PCWidgetDocument : Frontend.Vanilla.Content.Document,IPCWidget
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Class", "Single-Line Text", shared: true)]
        public string Class { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RouteValues", "Bwin Name Value List Unsorted", shared: true)]
        public ContentParameters RouteValues { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TitleLink", "SmartLink", shared: true)]
        public ContentLink TitleLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TridZone", "Single-Line Text", shared: true)]
        public string TridZone { get; }

        public PCWidgetDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Class = GetValue<string>("Class");
            Condition = GetValue<string>("Condition");
            Parameters = GetValue<ContentParameters>("Parameters");
            RouteValues = GetValue<ContentParameters>("RouteValues");
            Title = GetValue<string>("Title");
            TitleLink = GetValue<ContentLink>("TitleLink");
            TridZone = GetValue<string>("TridZone");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Plugin Root", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PluginRootDocument : Frontend.Vanilla.Content.Document,IPluginRoot
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DependentTo", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> DependentTo { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Messages", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Messages { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Product", "Checklist", shared: true)]
        public string Product { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ProductContact", "Multi-Line Text", shared: true)]
        public string ProductContact { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TechnicalContact", "Multi-Line Text", shared: true)]
        public string TechnicalContact { get; }

        public PluginRootDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            DependentTo = GetValue<IReadOnlyList<DocumentId>>("DependentTo");
            Messages = GetValue<ContentParameters>("Messages");
            Product = GetValue<string>("Product");
            ProductContact = GetValue<string>("ProductContact");
            TechnicalContact = GetValue<string>("TechnicalContact");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PM12ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PM12ColPageDocument : Frontend.Vanilla.Content.Document,IPM12ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Banner", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Banner { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentLeft", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentLeft { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentRight", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentRight { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PM12ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Banner = GetValue<IReadOnlyList<DocumentId>>("Banner");
            ContentLeft = GetValue<IReadOnlyList<DocumentId>>("ContentLeft");
            ContentRight = GetValue<IReadOnlyList<DocumentId>>("ContentRight");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PM1ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PM1ColPageDocument : Frontend.Vanilla.Content.Document,IPM1ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Content { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PM1ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Content = GetValue<IReadOnlyList<DocumentId>>("Content");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PM2ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PM2ColPageDocument : Frontend.Vanilla.Content.Document,IPM2ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentLeft", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentLeft { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentRight", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentRight { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PM2ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ContentLeft = GetValue<IReadOnlyList<DocumentId>>("ContentLeft");
            ContentRight = GetValue<IReadOnlyList<DocumentId>>("ContentRight");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMBasePage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PMBasePageDocument : Frontend.Vanilla.Content.Document,IPMBasePage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PMBasePageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMNav12ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PMNav12ColPageDocument : Frontend.Vanilla.Content.Document,IPMNav12ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Banner", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Banner { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentLeft", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentLeft { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentRight", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentRight { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Navigation", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Navigation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PMNav12ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Banner = GetValue<IReadOnlyList<DocumentId>>("Banner");
            ContentLeft = GetValue<IReadOnlyList<DocumentId>>("ContentLeft");
            ContentRight = GetValue<IReadOnlyList<DocumentId>>("ContentRight");
            Navigation = GetValue<IReadOnlyList<DocumentId>>("Navigation");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMNav13ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PMNav13ColPageDocument : Frontend.Vanilla.Content.Document,IPMNav13ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Banner", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Banner { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentCenter", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentCenter { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentLeft", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentLeft { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentRight", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentRight { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Navigation", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Navigation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PMNav13ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Banner = GetValue<IReadOnlyList<DocumentId>>("Banner");
            ContentCenter = GetValue<IReadOnlyList<DocumentId>>("ContentCenter");
            ContentLeft = GetValue<IReadOnlyList<DocumentId>>("ContentLeft");
            ContentRight = GetValue<IReadOnlyList<DocumentId>>("ContentRight");
            Navigation = GetValue<IReadOnlyList<DocumentId>>("Navigation");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMNav1ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PMNav1ColPageDocument : Frontend.Vanilla.Content.Document,IPMNav1ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Content { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Navigation", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Navigation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        public PMNav1ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Content = GetValue<IReadOnlyList<DocumentId>>("Content");
            Navigation = GetValue<IReadOnlyList<DocumentId>>("Navigation");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("PMSignpost12ColPage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class PMSignpost12ColPageDocument : Frontend.Vanilla.Content.Document,IPMSignpost12ColPage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Banner", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Banner { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentLeft", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentLeft { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentRight", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> ContentRight { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAlternateLinks", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageAlternateLinks { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageAssets", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> PageAssets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageClass", "Single-Line Text", shared: true)]
        public string PageClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageId", "Single-Line Text", shared: true)]
        public string PageId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageMetaTags", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters PageMetaTags { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Parameters", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters Parameters { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Signpost", "RelativeTreelist", shared: true)]
        public IReadOnlyList<DocumentId> Signpost { get; }

        public PMSignpost12ColPageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Banner = GetValue<IReadOnlyList<DocumentId>>("Banner");
            ContentLeft = GetValue<IReadOnlyList<DocumentId>>("ContentLeft");
            ContentRight = GetValue<IReadOnlyList<DocumentId>>("ContentRight");
            PageAlternateLinks = GetValue<ContentParameters>("PageAlternateLinks");
            PageAssets = GetValue<IReadOnlyList<DocumentId>>("PageAssets");
            PageClass = GetValue<string>("PageClass");
            PageDescription = GetValue<string>("PageDescription");
            PageId = GetValue<string>("PageId");
            PageMetaTags = GetValue<ContentParameters>("PageMetaTags");
            PageTitle = GetValue<string>("PageTitle");
            Parameters = GetValue<ContentParameters>("Parameters");
            Signpost = GetValue<IReadOnlyList<DocumentId>>("Signpost");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Proxy", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ProxyDocument : Frontend.Vanilla.Content.Document,IProxy
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Target", "Rules", shared: true)]
        public IReadOnlyList<ProxyRule> Target { get; }

        public ProxyDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Target = GetValue<IReadOnlyList<ProxyRule>>("Target");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ProxyFolder", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ProxyFolderDocument : Frontend.Vanilla.Content.Document,IProxyFolder
    {
        public ProxyFolderDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Retention", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class RetentionDocument : Frontend.Vanilla.Content.Document,IRetention
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ValidUpTo", "Datetime", shared: true)]
        public UtcDateTime ValidUpTo { get; }

        public RetentionDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ValidUpTo = GetValue<UtcDateTime>("ValidUpTo");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Signposting", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SignpostingDocument : Frontend.Vanilla.Content.Document,ISignposting
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BackgroundBannerImage", "Image", shared: true)]
        public ContentImage BackgroundBannerImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BannerDescription", "Rich Text", shared: false)]
        public string BannerDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BannerKeyTerms", "Rich Text", shared: false)]
        public string BannerKeyTerms { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BannerTitle", "Single-Line Text", shared: false)]
        public string BannerTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DetailsTermsAndConditions", "Rich Text", shared: false)]
        public string DetailsTermsAndConditions { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HeroBannerImage", "Image", shared: true)]
        public ContentImage HeroBannerImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MoreinfoCTA", "SmartLink", shared: false)]
        public ContentLink MoreinfoCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptinCTATitle", "Single-Line Text", shared: false)]
        public string OptinCTATitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OptionalCTA", "SmartLink", shared: false)]
        public ContentLink OptionalCTA { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsBackgroundImage", "Image", shared: true)]
        public ContentImage PromoDetailsBackgroundImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsDescription", "Rich Text", shared: false)]
        public string PromoDetailsDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsHeroImage", "Image", shared: true)]
        public ContentImage PromoDetailsHeroImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PromoDetailsTitle", "Single-Line Text", shared: false)]
        public string PromoDetailsTitle { get; }

        public SignpostingDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BackgroundBannerImage = GetValue<ContentImage>("BackgroundBannerImage");
            BannerDescription = GetValue<string>("BannerDescription");
            BannerKeyTerms = GetValue<string>("BannerKeyTerms");
            BannerTitle = GetValue<string>("BannerTitle");
            DetailsTermsAndConditions = GetValue<string>("DetailsTermsAndConditions");
            HeroBannerImage = GetValue<ContentImage>("HeroBannerImage");
            MoreinfoCTA = GetValue<ContentLink>("MoreinfoCTA");
            OptinCTATitle = GetValue<string>("OptinCTATitle");
            OptionalCTA = GetValue<ContentLink>("OptionalCTA");
            PromoDetailsBackgroundImage = GetValue<ContentImage>("PromoDetailsBackgroundImage");
            PromoDetailsDescription = GetValue<string>("PromoDetailsDescription");
            PromoDetailsHeroImage = GetValue<ContentImage>("PromoDetailsHeroImage");
            PromoDetailsTitle = GetValue<string>("PromoDetailsTitle");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Site Root", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SiteRootDocument : Frontend.Vanilla.Content.Document,ISiteRoot
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CanonicalDomains", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters CanonicalDomains { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DefaultPageTitle", "Single-Line Text", shared: false)]
        public string DefaultPageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ReplacementValues", "Bwin Name Value List Sorted", shared: true)]
        public ContentParameters ReplacementValues { get; }

        public SiteRootDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CanonicalDomains = GetValue<ContentParameters>("CanonicalDomains");
            DefaultPageTitle = GetValue<string>("DefaultPageTitle");
            ReplacementValues = GetValue<ContentParameters>("ReplacementValues");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("StaticFileTemplate", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class StaticFileTemplateDocument : Frontend.Vanilla.Content.Document,IStaticFileTemplate
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ClientCacheTime", "Integer", shared: true)]
        public int ClientCacheTime { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "Multi-Line Text", shared: true)]
        public string Content { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MimeType", "Single-Line Text", shared: true)]
        public string MimeType { get; }

        public StaticFileTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ClientCacheTime = GetValue<int>("ClientCacheTime");
            Condition = GetValue<string>("Condition");
            Content = GetValue<string>("Content");
            MimeType = GetValue<string>("MimeType");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SvgImage", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SvgImageDocument : Frontend.Vanilla.Content.Document,ISvgImage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CssClass", "Single-Line Text", shared: false)]
        public string CssClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CustomAnimation", "Single-Line Text", shared: false)]
        public string CustomAnimation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DefaultAnimation", "Checkbox", shared: false)]
        public bool DefaultAnimation { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Size", "Droplist", shared: false)]
        public string Size { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SvgImage", "Image", shared: true)]
        public ContentImage SvgImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Type", "Droplist", shared: false)]
        public string Type { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ViewBox", "Single-Line Text", shared: false)]
        public string ViewBox { get; }

        public SvgImageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CssClass = GetValue<string>("CssClass");
            CustomAnimation = GetValue<string>("CustomAnimation");
            DefaultAnimation = GetValue<bool>("DefaultAnimation");
            Size = GetValue<string>("Size");
            SvgImage = GetValue<ContentImage>("SvgImage");
            Type = GetValue<string>("Type");
            ViewBox = GetValue<string>("ViewBox");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("View Template", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ViewTemplateDocument : Frontend.Vanilla.Content.Document,IViewTemplate
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Condition", "Single-Line Text", shared: true)]
        public string Condition { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Messages", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Messages { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageDescription", "Single-Line Text", shared: false)]
        public string PageDescription { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PageTitle", "Single-Line Text", shared: false)]
        public string PageTitle { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Text", "Rich Text", shared: false)]
        public string Text { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Validation", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Validation { get; }

        public ViewTemplateDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Condition = GetValue<string>("Condition");
            Messages = GetValue<ContentParameters>("Messages");
            PageDescription = GetValue<string>("PageDescription");
            PageTitle = GetValue<string>("PageTitle");
            Text = GetValue<string>("Text");
            Title = GetValue<string>("Title");
            Validation = GetValue<ContentParameters>("Validation");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("VnIcon", typeof(Frontend.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "1.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class VnIconDocument : Frontend.Vanilla.Content.Document,IVnIcon
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ExtraClass", "Single-Line Text", shared: true)]
        public string ExtraClass { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FillColor", "Single-Line Text", shared: true)]
        public string FillColor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Size", "Single-Line Text", shared: true)]
        public string Size { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: true)]
        public string Title { get; }

        public VnIconDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ExtraClass = GetValue<string>("ExtraClass");
            FillColor = GetValue<string>("FillColor");
            Image = GetValue<ContentImage>("Image");
            Size = GetValue<string>("Size");
            Title = GetValue<string>("Title");
        }
    }
}
#pragma warning restore 1591
