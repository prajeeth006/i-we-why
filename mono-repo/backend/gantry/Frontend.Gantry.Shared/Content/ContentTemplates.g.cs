#pragma warning disable 1591
#nullable enable
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using Frontend.Gantry.Shared.Content.Implementation;

namespace Frontend.Gantry.Shared.Content
{
    /// <summary>
    /// Interface that maps to the <c>AssetType</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("AssetType", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IAssetType : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>AssetName</c> content field.
        /// </summary>
        string? AssetName { get; }

        /// <summary>
        /// Property that maps to the <c>AssetsPath</c> content field.
        /// </summary>
        DocumentId? AssetsPath { get; }

        /// <summary>
        /// Property that maps to the <c>AssetType</c> content field.
        /// </summary>
        string? AssetType { get; }

        /// <summary>
        /// Property that maps to the <c>isAssetType</c> content field.
        /// </summary>
        bool IsAssetType { get; }

        /// <summary>
        /// Property that maps to the <c>isAutoExpand</c> content field.
        /// </summary>
        string? IsAutoExpand { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>BrandImage</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("BrandImage", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IBrandImage : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>BrandImage</c> content field.
        /// </summary>
        ContentImage? BrandImage { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Cricket</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Cricket", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ICricket : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>BackgroundImage</c> content field.
        /// </summary>
        ContentImage? BackgroundImage { get; }

        /// <summary>
        /// Property that maps to the <c>ContentMediaType</c> content field.
        /// </summary>
        DocumentId? ContentMediaType { get; }

        /// <summary>
        /// Property that maps to the <c>Description</c> content field.
        /// </summary>
        string? Description { get; }

        /// <summary>
        /// Property that maps to the <c>ForegroundImage</c> content field.
        /// </summary>
        ContentImage? ForegroundImage { get; }

        /// <summary>
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>FooterAttributes</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("FooterAttributes", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IFooterAttributes : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>backgroundcolor</c> content field.
        /// </summary>
        string? Backgroundcolor { get; }

        /// <summary>
        /// Property that maps to the <c>border</c> content field.
        /// </summary>
        string? Border { get; }

        /// <summary>
        /// Property that maps to the <c>color</c> content field.
        /// </summary>
        string? Color { get; }

        /// <summary>
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary>
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }

        /// <summary>
        /// Property that maps to the <c>Type</c> content field.
        /// </summary>
        string? Type { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>GantryConfigItem</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigItem", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGantryConfigItem : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>Archive</c> content field.
        /// </summary>
        bool Archive { get; }

        /// <summary>
        /// Property that maps to the <c>Content</c> content field.
        /// </summary>
        string? Content { get; }

        /// <summary>
        /// Property that maps to the <c>TargetingConfiguration</c> content field.
        /// </summary>
        string? TargetingConfiguration { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>GantryConfigMultiViewItem</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigMultiViewItem", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGantryConfigMultiViewItem : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>Archive</c> content field.
        /// </summary>
        bool Archive { get; }

        /// <summary>
        /// Property that maps to the <c>TargetingConfiguration</c> content field.
        /// </summary>
        string? TargetingConfiguration { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>GreyHoundImages</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GreyHoundImages", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGreyHoundImages : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>RunnerEight</c> content field.
        /// </summary>
        ContentImage? RunnerEight { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerFive</c> content field.
        /// </summary>
        ContentImage? RunnerFive { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerFour</c> content field.
        /// </summary>
        ContentImage? RunnerFour { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerNine</c> content field.
        /// </summary>
        ContentImage? RunnerNine { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerOne</c> content field.
        /// </summary>
        ContentImage? RunnerOne { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerSeven</c> content field.
        /// </summary>
        ContentImage? RunnerSeven { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerSix</c> content field.
        /// </summary>
        ContentImage? RunnerSix { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerTen</c> content field.
        /// </summary>
        ContentImage? RunnerTen { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerThree</c> content field.
        /// </summary>
        ContentImage? RunnerThree { get; }

        /// <summary>
        /// Property that maps to the <c>RunnerTwo</c> content field.
        /// </summary>
        ContentImage? RunnerTwo { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>LabelUrl</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LabelUrl", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ILabelUrl : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>SmartLink</c> content field.
        /// </summary>
        ContentLink? SmartLink { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>LeftTreeHideShowData</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LeftTreeHideShowData", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ILeftTreeHideShowData : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>HideShowData</c> content field.
        /// </summary>
        string? HideShowData { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>MultiEvent</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MultiEvent", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IMultiEvent : IStandard
    {
        /// <summary>
        /// Property that maps to the <c>GTCMarkets</c> content field.
        /// </summary>
        string? GTCMarkets { get; }

        /// <summary>
        /// Property that maps to the <c>GTCTargetLink</c> content field.
        /// </summary>
        DocumentId? GTCTargetLink { get; }

        /// <summary>
        /// Property that maps to the <c>IsPageDoesNotDependsOnEvents</c> content field.
        /// </summary>
        bool IsPageDoesNotDependsOnEvents { get; }

        /// <summary>
        /// Property that maps to the <c>MultieventTemplateName</c> content field.
        /// </summary>
        string? MultieventTemplateName { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>MultiEventList</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MultiEventList", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IMultiEventList : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>EventList</c> content field.
        /// </summary>
        string? EventList { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ProfileSetting</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ProfileSetting", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IProfileSetting : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>Name</c> content field.
        /// </summary>
        string? Name { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>RacingAndSportsManualEvents</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("RacingAndSportsManualEvents", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IRacingAndSportsManualEvents : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>ContentMediaType</c> content field.
        /// </summary>
        DocumentId? ContentMediaType { get; }

        /// <summary>
        /// Property that maps to the <c>EventFormData</c> content field.
        /// </summary>
        string? EventFormData { get; }

        /// <summary>
        /// Property that maps to the <c>TargetId</c> content field.
        /// </summary>
        DocumentId? TargetId { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>RacingAssetImages</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("RacingAssetImages", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IRacingAssetImages : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>CoralHorseImage</c> content field.
        /// </summary>
        ContentImage? CoralHorseImage { get; }

        /// <summary>
        /// Property that maps to the <c>LadsHorseImage</c> content field.
        /// </summary>
        ContentImage? LadsHorseImage { get; }

        /// <summary>
        /// Property that maps to the <c>RacingPostTip</c> content field.
        /// </summary>
        ContentImage? RacingPostTip { get; }

        /// <summary>
        /// Property that maps to the <c>GreyHoundRacingPostPic</c> content field.
        /// </summary>
        ContentImage? GreyHoundRacingPostPic { get; }

        /// <summary>
        /// Property that maps to the <c>ToolTip</c> content field.
        /// </summary>
        string? ToolTip { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ScreenDesignAttributes</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenDesignAttributes", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IScreenDesignAttributes : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>AssetActiveIcon</c> content field.
        /// </summary>
        DocumentId? AssetActiveIcon { get; }

        /// <summary>
        /// Property that maps to the <c>AssetColor</c> content field.
        /// </summary>
        string? AssetColor { get; }

        /// <summary>
        /// Property that maps to the <c>AssetDisabledIcon</c> content field.
        /// </summary>
        DocumentId? AssetDisabledIcon { get; }

        /// <summary>
        /// Property that maps to the <c>PlaceholderDisabledIcon</c> content field.
        /// </summary>
        DocumentId? PlaceholderDisabledIcon { get; }

        /// <summary>
        /// Property that maps to the <c>PlaceholderIcon</c> content field.
        /// </summary>
        DocumentId? PlaceholderIcon { get; }

        /// <summary>
        /// Property that maps to the <c>ScreenBackgroundColor</c> content field.
        /// </summary>
        string? ScreenBackgroundColor { get; }

        /// <summary>
        /// Property that maps to the <c>ScreenBorderColor</c> content field.
        /// </summary>
        string? ScreenBorderColor { get; }

        /// <summary>
        /// Property that maps to the <c>TextColor</c> content field.
        /// </summary>
        string? TextColor { get; }

        /// <summary>
        /// Property that maps to the <c>TypeName</c> content field.
        /// </summary>
        string? TypeName { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ScreenJsonRule</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenJsonRule", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IScreenJsonRule : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>Asset</c> content field.
        /// </summary>
        string? Asset { get; }

        /// <summary>
        /// Property that maps to the <c>Duration</c> content field.
        /// </summary>
        int Duration { get; }

        /// <summary>
        /// Property that maps to the <c>GantryScreens</c> content field.
        /// </summary>
        string? GantryScreens { get; }

        /// <summary>
        /// Property that maps to the <c>SortOrder</c> content field.
        /// </summary>
        int SortOrder { get; }

        /// <summary>
        /// Property that maps to the <c>Url</c> content field.
        /// </summary>
        string? Url { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ScreenMappings</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenMappings", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IScreenMappings : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>MapConfig</c> content field.
        /// </summary>
        string? MapConfig { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ScreenSaveComplete</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenSaveComplete", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IScreenSaveComplete : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>Email</c> content field.
        /// </summary>
        string? Email { get; }

        /// <summary>
        /// Property that maps to the <c>ProfileName</c> content field.
        /// </summary>
        string? ProfileName { get; }

        /// <summary>
        /// Property that maps to the <c>Timestamp</c> content field.
        /// </summary>
        string? Timestamp { get; }

        /// <summary>
        /// Property that maps to the <c>UserName</c> content field.
        /// </summary>
        string? UserName { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ScreensInDisplayManager</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreensInDisplayManager", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IScreensInDisplayManager : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>ScreenLayout</c> content field.
        /// </summary>
        string? ScreenLayout { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>SportsChannels</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsChannels", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISportsChannels : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>ChannelId</c> content field.
        /// </summary>
        string? ChannelId { get; }

        /// <summary>
        /// Property that maps to the <c>ChannelName</c> content field.
        /// </summary>
        string? ChannelName { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>SportsEvent</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsEvent", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISportsEvent : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>BoxingImage</c> content field.
        /// </summary>
        ContentImage? BoxingImage { get; }

        /// <summary>
        /// Property that maps to the <c>BrandLogo</c> content field.
        /// </summary>
        ContentImage? BrandLogo { get; }

        /// <summary>
        /// Property that maps to the <c>Content</c> content field.
        /// </summary>
        ContentParameters Content { get; }

        /// <summary>
        /// Property that maps to the <c>CoralBoxingImage</c> content field.
        /// </summary>
        ContentImage? CoralBoxingImage { get; }

        /// <summary>
        /// Property that maps to the <c>CricketRedImage</c> content field.
        /// </summary>
        ContentImage? CricketRedImage { get; }

        /// <summary>
        /// Property that maps to the <c>CricketWhiteImage</c> content field.
        /// </summary>
        ContentImage? CricketWhiteImage { get; }

        /// <summary>
        /// Property that maps to the <c>CyclingImage</c> content field.
        /// </summary>
        ContentImage? CyclingImage { get; }

        /// <summary>
        /// Property that maps to the <c>DarkThemeLatestResultImage</c> content field.
        /// </summary>
        ContentImage? DarkThemeLatestResultImage { get; }

        /// <summary>
        /// Property that maps to the <c>DarkThemeRacingPostImage</c> content field.
        /// </summary>
        ContentImage? DarkThemeRacingPostImage { get; }

        /// <summary>
        /// Property that maps to the <c>DartsImage</c> content field.
        /// </summary>
        ContentImage? DartsImage { get; }

        /// <summary>
        /// Property that maps to the <c>EntertainmentImage</c> content field.
        /// </summary>
        ContentImage? EntertainmentImage { get; }

        /// <summary>
        /// Property that maps to the <c>EpsFooterLogoNewDesign</c> content field.
        /// </summary>
        ContentImage? EpsFooterLogoNewDesign { get; }

        /// <summary>
        /// Property that maps to the <c>FallbackImage</c> content field.
        /// </summary>
        ContentImage? FallbackImage { get; }

        /// <summary>
        /// Property that maps to the <c>FootballImage</c> content field.
        /// </summary>
        ContentImage? FootballImage { get; }

        /// <summary>
        /// Property that maps to the <c>FormulaRacingImage</c> content field.
        /// </summary>
        ContentImage? FormulaRacingImage { get; }

        /// <summary>
        /// Property that maps to the <c>GolfImage</c> content field.
        /// </summary>
        ContentImage? GolfImage { get; }

        /// <summary>
        /// Property that maps to the <c>GreyHoundRacingImage</c> content field.
        /// </summary>
        ContentImage? GreyHoundRacingImage { get; }

        /// <summary>
        /// Property that maps to the <c>HorseRacingImage</c> content field.
        /// </summary>
        ContentImage? HorseRacingImage { get; }

        /// <summary>
        /// Property that maps to the <c>MoneyBoostImage</c> content field.
        /// </summary>
        ContentImage? MoneyBoostImage { get; }

        /// <summary>
        /// Property that maps to the <c>NflImage</c> content field.
        /// </summary>
        ContentImage? NflImage { get; }

        /// <summary>
        /// Property that maps to the <c>OlympicsImage</c> content field.
        /// </summary>
        ContentImage? OlympicsImage { get; }

        /// <summary>
        /// Property that maps to the <c>PoliticsImage</c> content field.
        /// </summary>
        ContentImage? PoliticsImage { get; }

        /// <summary>
        /// Property that maps to the <c>RacingPostImage</c> content field.
        /// </summary>
        ContentImage? RacingPostImage { get; }

        /// <summary>
        /// Property that maps to the <c>RacingPostImageFull</c> content field.
        /// </summary>
        ContentImage? RacingPostImageFull { get; }

        /// <summary>
        /// Property that maps to the <c>GreyHoundRacingPostPic</c> content field.
        /// </summary>
        ContentImage? GreyHoundRacingPostPic { get; }

        /// <summary>
        /// Property that maps to the <c>RacingVirtualImage</c> content field.
        /// </summary>
        ContentImage? RacingVirtualImage { get; }

        /// <summary>
        /// Property that maps to the <c>RugbyLeagueImage</c> content field.
        /// </summary>
        ContentImage? RugbyLeagueImage { get; }

        /// <summary>
        /// Property that maps to the <c>RugbyUnionImage</c> content field.
        /// </summary>
        ContentImage? RugbyUnionImage { get; }

        /// <summary>
        /// Property that maps to the <c>ScrollingRacingPostTip</c> content field.
        /// </summary>
        ContentImage? ScrollingRacingPostTip { get; }

        /// <summary>
        /// Property that maps to the <c>SnookerImage</c> content field.
        /// </summary>
        ContentImage? SnookerImage { get; }

        /// <summary>
        /// Property that maps to the <c>SpecialsImage</c> content field.
        /// </summary>
        ContentImage? SpecialsImage { get; }

        /// <summary>
        /// Property that maps to the <c>TennisImage</c> content field.
        /// </summary>
        ContentImage? TennisImage { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Standard</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Standard", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IStandard : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>AddAllMarketsProduct</c> content field.
        /// </summary>
        bool AddAllMarketsProduct { get; }

        /// <summary>
        /// Property that maps to the <c>AssetName</c> content field.
        /// </summary>
        string? AssetName { get; }

        /// <summary>
        /// Property that maps to the <c>AssetType</c> content field.
        /// </summary>
        string? AssetType { get; }

        /// <summary>
        /// Property that maps to the <c>CheckForOutRightEvent</c> content field.
        /// </summary>
        bool CheckForOutRightEvent { get; }

        /// <summary>
        /// Property that maps to the <c>ContentMediaType</c> content field.
        /// </summary>
        DocumentId? ContentMediaType { get; }

        /// <summary>
        /// Property that maps to the <c>Markets</c> content field.
        /// </summary>
        string? Markets { get; }

        /// <summary>
        /// Property that maps to the <c>TargetLink</c> content field.
        /// </summary>
        DocumentId? TargetLink { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Tabs</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Tabs", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ITabs : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>Image</c> content field.
        /// </summary>
        ContentImage? Image { get; }

        /// <summary>
        /// Property that maps to the <c>Title</c> content field.
        /// </summary>
        string? Title { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>TradingTemplates</c> content template.
    /// </summary>
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("TradingTemplates", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ITradingTemplates : Frontend.Vanilla.Content.IDocument
    {
        /// <summary>
        /// Property that maps to the <c>ContentMediaType</c> content field.
        /// </summary>
        DocumentId? ContentMediaType { get; }

        /// <summary>
        /// Property that maps to the <c>DragAndDropAssetName</c> content field.
        /// </summary>
        string? DragAndDropAssetName { get; }

        /// <summary>
        /// Property that maps to the <c>MarketNames</c> content field.
        /// </summary>
        string? MarketNames { get; }

        /// <summary>
        /// Property that maps to the <c>TargetLink</c> content field.
        /// </summary>
        DocumentId? TargetLink { get; }

        /// <summary>
        /// Property that maps to the <c>TemplateIds</c> content field.
        /// </summary>
        string? TemplateIds { get; }
    }
}

namespace Frontend.Gantry.Shared.Content.Implementation
{
    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("AssetType", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class AssetTypeDocument : Frontend.Vanilla.Content.Document,IAssetType
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetName", "Single-Line Text", shared: true)]
        public string AssetName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetsPath", "Droptree", shared: true)]
        public DocumentId AssetsPath { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetType", "Single-Line Text", shared: true)]
        public string AssetType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("isAssetType", "Checkbox", shared: true)]
        public bool IsAssetType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("isAutoExpand", "Single-Line Text", shared: true)]
        public string IsAutoExpand { get; }

        public AssetTypeDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            AssetName = GetValue<string>("AssetName");
            AssetsPath = GetValue<DocumentId>("AssetsPath");
            AssetType = GetValue<string>("AssetType");
            IsAssetType = GetValue<bool>("isAssetType");
            IsAutoExpand = GetValue<string>("isAutoExpand");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("BrandImage", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class BrandImageDocument : Frontend.Vanilla.Content.Document,IBrandImage
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BrandImage", "Image", shared: true)]
        public ContentImage BrandImage { get; }

        public BrandImageDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BrandImage = GetValue<ContentImage>("BrandImage");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Cricket", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class CricketDocument : Frontend.Vanilla.Content.Document,ICricket
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BackgroundImage", "Image", shared: true)]
        public ContentImage BackgroundImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentMediaType", "Droplink", shared: true)]
        public DocumentId ContentMediaType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Description", "Rich Text", shared: false)]
        public string Description { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ForegroundImage", "Image", shared: true)]
        public ContentImage ForegroundImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        public CricketDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BackgroundImage = GetValue<ContentImage>("BackgroundImage");
            ContentMediaType = GetValue<DocumentId>("ContentMediaType");
            Description = GetValue<string>("Description");
            ForegroundImage = GetValue<ContentImage>("ForegroundImage");
            Title = GetValue<string>("Title");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("FooterAttributes", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class FooterAttributesDocument : Frontend.Vanilla.Content.Document,IFooterAttributes
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("backgroundcolor", "Single-Line Text", shared: true)]
        public string Backgroundcolor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("border", "Single-Line Text", shared: true)]
        public string Border { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("color", "Single-Line Text", shared: true)]
        public string Color { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: true)]
        public string Title { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Type", "Single-Line Text", shared: true)]
        public string Type { get; }

        public FooterAttributesDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Backgroundcolor = GetValue<string>("backgroundcolor");
            Border = GetValue<string>("border");
            Color = GetValue<string>("color");
            Image = GetValue<ContentImage>("Image");
            Title = GetValue<string>("Title");
            Type = GetValue<string>("Type");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigItem", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GantryConfigItemDocument : Frontend.Vanilla.Content.Document,IGantryConfigItem
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Archive", "Checkbox", shared: true)]
        public bool Archive { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "BwinTable", shared: true)]
        public string Content { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TargetingConfiguration", "Rules", shared: true)]
        public string TargetingConfiguration { get; }

        public GantryConfigItemDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Archive = GetValue<bool>("Archive");
            Content = GetValue<string>("Content");
            TargetingConfiguration = GetValue<string>("TargetingConfiguration");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigMultiViewItem", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GantryConfigMultiViewItemDocument : Frontend.Vanilla.Content.Document,IGantryConfigMultiViewItem
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Archive", "Checkbox", shared: true)]
        public bool Archive { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TargetingConfiguration", "Rules", shared: true)]
        public string TargetingConfiguration { get; }

        public GantryConfigMultiViewItemDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Archive = GetValue<bool>("Archive");
            TargetingConfiguration = GetValue<string>("TargetingConfiguration");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GreyHoundImages", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GreyHoundImagesDocument : Frontend.Vanilla.Content.Document,IGreyHoundImages
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerEight", "Image", shared: true)]
        public ContentImage RunnerEight { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerFive", "Image", shared: true)]
        public ContentImage RunnerFive { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerFour", "Image", shared: true)]
        public ContentImage RunnerFour { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerNine", "Image", shared: true)]
        public ContentImage RunnerNine { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerOne", "Image", shared: true)]
        public ContentImage RunnerOne { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerSeven", "Image", shared: true)]
        public ContentImage RunnerSeven { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerSix", "Image", shared: true)]
        public ContentImage RunnerSix { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerTen", "Image", shared: true)]
        public ContentImage RunnerTen { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerThree", "Image", shared: true)]
        public ContentImage RunnerThree { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerTwo", "Image", shared: true)]
        public ContentImage RunnerTwo { get; }

        public GreyHoundImagesDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            RunnerEight = GetValue<ContentImage>("RunnerEight");
            RunnerFive = GetValue<ContentImage>("RunnerFive");
            RunnerFour = GetValue<ContentImage>("RunnerFour");
            RunnerNine = GetValue<ContentImage>("RunnerNine");
            RunnerOne = GetValue<ContentImage>("RunnerOne");
            RunnerSeven = GetValue<ContentImage>("RunnerSeven");
            RunnerSix = GetValue<ContentImage>("RunnerSix");
            RunnerTen = GetValue<ContentImage>("RunnerTen");
            RunnerThree = GetValue<ContentImage>("RunnerThree");
            RunnerTwo = GetValue<ContentImage>("RunnerTwo");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LabelUrl", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class LabelUrlDocument : Frontend.Vanilla.Content.Document,ILabelUrl
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SmartLink", "SmartLink", shared: true)]
        public ContentLink SmartLink { get; }

        public LabelUrlDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            SmartLink = GetValue<ContentLink>("SmartLink");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LeftTreeHideShowData", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class LeftTreeHideShowDataDocument : Frontend.Vanilla.Content.Document,ILeftTreeHideShowData
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HideShowData", "JsonField", shared: true)]
        public string HideShowData { get; }

        public LeftTreeHideShowDataDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            HideShowData = GetValue<string>("HideShowData");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MultiEvent", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class MultiEventDocument : Frontend.Vanilla.Content.Document,IMultiEvent
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AddAllMarketsProduct", "Checkbox", shared: true)]
        public bool AddAllMarketsProduct { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetName", "Single-Line Text", shared: false)]
        public string AssetName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetType", "Single-Line Text", shared: false)]
        public string AssetType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CheckForOutRightEvent", "Checkbox", shared: true)]
        public bool CheckForOutRightEvent { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentMediaType", "Droplink", shared: true)]
        public DocumentId ContentMediaType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GTCMarkets", "Single-Line Text", shared: false)]
        public string GTCMarkets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GTCTargetLink", "Droptree", shared: false)]
        public DocumentId GTCTargetLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("IsPageDoesNotDependsOnEvents", "Checkbox", shared: true)]
        public bool IsPageDoesNotDependsOnEvents { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Markets", "Single-Line Text", shared: true)]
        public string Markets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MultieventTemplateName", "Single-Line Text", shared: true)]
        public string MultieventTemplateName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TargetLink", "Droptree", shared: true)]
        public DocumentId TargetLink { get; }

        public MultiEventDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            AddAllMarketsProduct = GetValue<bool>("AddAllMarketsProduct");
            AssetName = GetValue<string>("AssetName");
            AssetType = GetValue<string>("AssetType");
            CheckForOutRightEvent = GetValue<bool>("CheckForOutRightEvent");
            ContentMediaType = GetValue<DocumentId>("ContentMediaType");
            GTCMarkets = GetValue<string>("GTCMarkets");
            GTCTargetLink = GetValue<DocumentId>("GTCTargetLink");
            IsPageDoesNotDependsOnEvents = GetValue<bool>("IsPageDoesNotDependsOnEvents");
            Markets = GetValue<string>("Markets");
            MultieventTemplateName = GetValue<string>("MultieventTemplateName");
            TargetLink = GetValue<DocumentId>("TargetLink");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MultiEventList", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class MultiEventListDocument : Frontend.Vanilla.Content.Document,IMultiEventList
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EventList", "JsonField", shared: true)]
        public string EventList { get; }

        public MultiEventListDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            EventList = GetValue<string>("EventList");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ProfileSetting", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ProfileSettingDocument : Frontend.Vanilla.Content.Document,IProfileSetting
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Name", "Single-Line Text", shared: true)]
        public string Name { get; }

        public ProfileSettingDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Name = GetValue<string>("Name");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("RacingAndSportsManualEvents", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class RacingAndSportsManualEventsDocument : Frontend.Vanilla.Content.Document,IRacingAndSportsManualEvents
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentMediaType", "Droplink", shared: true)]
        public DocumentId ContentMediaType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EventFormData", "JsonField", shared: true)]
        public string EventFormData { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TargetId", "Droptree", shared: true)]
        public DocumentId TargetId { get; }

        public RacingAndSportsManualEventsDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ContentMediaType = GetValue<DocumentId>("ContentMediaType");
            EventFormData = GetValue<string>("EventFormData");
            TargetId = GetValue<DocumentId>("TargetId");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("RacingAssetImages", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class RacingAssetImagesDocument : Frontend.Vanilla.Content.Document,IRacingAssetImages
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CoralHorseImage", "Image", shared: false)]
        public ContentImage CoralHorseImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("LadsHorseImage", "Image", shared: false)]
        public ContentImage LadsHorseImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RacingPostTip", "Image", shared: false)]
        public ContentImage RacingPostTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GreyHoundRacingPostPic", "Image", shared: false)]
        public ContentImage GreyHoundRacingPostPic { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ToolTip", "Single-Line Text", shared: false)]
        public string ToolTip { get; }

        public RacingAssetImagesDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            CoralHorseImage = GetValue<ContentImage>("CoralHorseImage");
            LadsHorseImage = GetValue<ContentImage>("LadsHorseImage");
            RacingPostTip = GetValue<ContentImage>("RacingPostTip");
            GreyHoundRacingPostPic = GetValue<ContentImage>("GreyHoundRacingPostPic");
            ToolTip = GetValue<string>("ToolTip");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenDesignAttributes", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ScreenDesignAttributesDocument : Frontend.Vanilla.Content.Document,IScreenDesignAttributes
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetActiveIcon", "Droptree", shared: true)]
        public DocumentId AssetActiveIcon { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetColor", "Single-Line Text", shared: false)]
        public string AssetColor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetDisabledIcon", "Droptree", shared: true)]
        public DocumentId AssetDisabledIcon { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PlaceholderDisabledIcon", "Droptree", shared: true)]
        public DocumentId PlaceholderDisabledIcon { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PlaceholderIcon", "Droptree", shared: true)]
        public DocumentId PlaceholderIcon { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ScreenBackgroundColor", "Single-Line Text", shared: false)]
        public string ScreenBackgroundColor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ScreenBorderColor", "Single-Line Text", shared: true)]
        public string ScreenBorderColor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TextColor", "Single-Line Text", shared: true)]
        public string TextColor { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TypeName", "Single-Line Text", shared: true)]
        public string TypeName { get; }

        public ScreenDesignAttributesDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            AssetActiveIcon = GetValue<DocumentId>("AssetActiveIcon");
            AssetColor = GetValue<string>("AssetColor");
            AssetDisabledIcon = GetValue<DocumentId>("AssetDisabledIcon");
            PlaceholderDisabledIcon = GetValue<DocumentId>("PlaceholderDisabledIcon");
            PlaceholderIcon = GetValue<DocumentId>("PlaceholderIcon");
            ScreenBackgroundColor = GetValue<string>("ScreenBackgroundColor");
            ScreenBorderColor = GetValue<string>("ScreenBorderColor");
            TextColor = GetValue<string>("TextColor");
            TypeName = GetValue<string>("TypeName");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenJsonRule", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ScreenJsonRuleDocument : Frontend.Vanilla.Content.Document,IScreenJsonRule
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Asset", "JsonField", shared: true)]
        public string Asset { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Duration", "Integer", shared: true)]
        public int Duration { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GantryScreens", "JsonField", shared: true)]
        public string GantryScreens { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SortOrder", "Integer", shared: true)]
        public int SortOrder { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Url", "Single-Line Text", shared: true)]
        public string Url { get; }

        public ScreenJsonRuleDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Asset = GetValue<string>("Asset");
            Duration = GetValue<int>("Duration");
            GantryScreens = GetValue<string>("GantryScreens");
            SortOrder = GetValue<int>("SortOrder");
            Url = GetValue<string>("Url");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenMappings", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ScreenMappingsDocument : Frontend.Vanilla.Content.Document,IScreenMappings
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MapConfig", "JsonField", shared: true)]
        public string MapConfig { get; }

        public ScreenMappingsDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            MapConfig = GetValue<string>("MapConfig");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreenSaveComplete", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ScreenSaveCompleteDocument : Frontend.Vanilla.Content.Document,IScreenSaveComplete
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Email", "Single-Line Text", shared: true)]
        public string Email { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ProfileName", "Single-Line Text", shared: true)]
        public string ProfileName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Timestamp", "Single-Line Text", shared: true)]
        public string Timestamp { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("UserName", "Single-Line Text", shared: true)]
        public string UserName { get; }

        public ScreenSaveCompleteDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Email = GetValue<string>("Email");
            ProfileName = GetValue<string>("ProfileName");
            Timestamp = GetValue<string>("Timestamp");
            UserName = GetValue<string>("UserName");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreensInDisplayManager", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ScreensInDisplayManagerDocument : Frontend.Vanilla.Content.Document,IScreensInDisplayManager
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ScreenLayout", "JsonField", shared: true)]
        public string ScreenLayout { get; }

        public ScreensInDisplayManagerDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ScreenLayout = GetValue<string>("ScreenLayout");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsChannels", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SportsChannelsDocument : Frontend.Vanilla.Content.Document,ISportsChannels
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ChannelId", "Single-Line Text", shared: true)]
        public string ChannelId { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ChannelName", "Single-Line Text", shared: true)]
        public string ChannelName { get; }

        public SportsChannelsDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ChannelId = GetValue<string>("ChannelId");
            ChannelName = GetValue<string>("ChannelName");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsEvent", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SportsEventDocument : Frontend.Vanilla.Content.Document,ISportsEvent
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BoxingImage", "Image", shared: true)]
        public ContentImage BoxingImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("BrandLogo", "Image", shared: true)]
        public ContentImage BrandLogo { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Content { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CoralBoxingImage", "Image", shared: true)]
        public ContentImage CoralBoxingImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CricketRedImage", "Image", shared: true)]
        public ContentImage CricketRedImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CricketWhiteImage", "Image", shared: true)]
        public ContentImage CricketWhiteImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CyclingImage", "Image", shared: true)]
        public ContentImage CyclingImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DarkThemeLatestResultImage", "Image", shared: true)]
        public ContentImage DarkThemeLatestResultImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DarkThemeRacingPostImage", "Image", shared: true)]
        public ContentImage DarkThemeRacingPostImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DartsImage", "Image", shared: true)]
        public ContentImage DartsImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EntertainmentImage", "Image", shared: true)]
        public ContentImage EntertainmentImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("EpsFooterLogoNewDesign", "Image", shared: true)]
        public ContentImage EpsFooterLogoNewDesign { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FallbackImage", "Image", shared: true)]
        public ContentImage FallbackImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FootballImage", "Image", shared: true)]
        public ContentImage FootballImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("FormulaRacingImage", "Image", shared: true)]
        public ContentImage FormulaRacingImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GolfImage", "Image", shared: true)]
        public ContentImage GolfImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GreyHoundRacingImage", "Image", shared: true)]
        public ContentImage GreyHoundRacingImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("HorseRacingImage", "Image", shared: true)]
        public ContentImage HorseRacingImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MoneyBoostImage", "Image", shared: true)]
        public ContentImage MoneyBoostImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("NflImage", "Image", shared: true)]
        public ContentImage NflImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("OlympicsImage", "Image", shared: true)]
        public ContentImage OlympicsImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("PoliticsImage", "Image", shared: true)]
        public ContentImage PoliticsImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RacingPostImage", "Image", shared: true)]
        public ContentImage RacingPostImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RacingPostImageFull", "Image", shared: true)]
        public ContentImage RacingPostImageFull { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("GreyHoundRacingPostPic", "Image", shared: true)]
        public ContentImage GreyHoundRacingPostPic { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RacingVirtualImage", "Image", shared: true)]
        public ContentImage RacingVirtualImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RugbyLeagueImage", "Image", shared: true)]
        public ContentImage RugbyLeagueImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("RugbyUnionImage", "Image", shared: true)]
        public ContentImage RugbyUnionImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ScrollingRacingPostTip", "Image", shared: true)]
        public ContentImage ScrollingRacingPostTip { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SnookerImage", "Image", shared: true)]
        public ContentImage SnookerImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("SpecialsImage", "Image", shared: true)]
        public ContentImage SpecialsImage { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TennisImage", "Image", shared: true)]
        public ContentImage TennisImage { get; }

        public SportsEventDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BoxingImage = GetValue<ContentImage>("BoxingImage");
            BrandLogo = GetValue<ContentImage>("BrandLogo");
            Content = GetValue<ContentParameters>("Content");
            CoralBoxingImage = GetValue<ContentImage>("CoralBoxingImage");
            CricketRedImage = GetValue<ContentImage>("CricketRedImage");
            CricketWhiteImage = GetValue<ContentImage>("CricketWhiteImage");
            CyclingImage = GetValue<ContentImage>("CyclingImage");
            DarkThemeLatestResultImage = GetValue<ContentImage>("DarkThemeLatestResultImage");
            DarkThemeRacingPostImage = GetValue<ContentImage>("DarkThemeRacingPostImage");
            DartsImage = GetValue<ContentImage>("DartsImage");
            EntertainmentImage = GetValue<ContentImage>("EntertainmentImage");
            EpsFooterLogoNewDesign = GetValue<ContentImage>("EpsFooterLogoNewDesign");
            FallbackImage = GetValue<ContentImage>("FallbackImage");
            FootballImage = GetValue<ContentImage>("FootballImage");
            FormulaRacingImage = GetValue<ContentImage>("FormulaRacingImage");
            GolfImage = GetValue<ContentImage>("GolfImage");
            GreyHoundRacingImage = GetValue<ContentImage>("GreyHoundRacingImage");
            HorseRacingImage = GetValue<ContentImage>("HorseRacingImage");
            MoneyBoostImage = GetValue<ContentImage>("MoneyBoostImage");
            NflImage = GetValue<ContentImage>("NflImage");
            OlympicsImage = GetValue<ContentImage>("OlympicsImage");
            PoliticsImage = GetValue<ContentImage>("PoliticsImage");
            RacingPostImage = GetValue<ContentImage>("RacingPostImage");
            RacingPostImageFull = GetValue<ContentImage>("RacingPostImageFull");
            GreyHoundRacingPostPic = GetValue<ContentImage>("GreyHoundRacingPostPic");
            RacingVirtualImage = GetValue<ContentImage>("RacingVirtualImage");
            RugbyLeagueImage = GetValue<ContentImage>("RugbyLeagueImage");
            RugbyUnionImage = GetValue<ContentImage>("RugbyUnionImage");
            ScrollingRacingPostTip = GetValue<ContentImage>("ScrollingRacingPostTip");
            SnookerImage = GetValue<ContentImage>("SnookerImage");
            SpecialsImage = GetValue<ContentImage>("SpecialsImage");
            TennisImage = GetValue<ContentImage>("TennisImage");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Standard", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class StandardDocument : Frontend.Vanilla.Content.Document,IStandard
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AddAllMarketsProduct", "Checkbox", shared: true)]
        public bool AddAllMarketsProduct { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetName", "Single-Line Text", shared: false)]
        public string AssetName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("AssetType", "Single-Line Text", shared: false)]
        public string AssetType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("CheckForOutRightEvent", "Checkbox", shared: true)]
        public bool CheckForOutRightEvent { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentMediaType", "Droplink", shared: true)]
        public DocumentId ContentMediaType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Markets", "Single-Line Text", shared: true)]
        public string Markets { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TargetLink", "Droptree", shared: true)]
        public DocumentId TargetLink { get; }

        public StandardDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            AddAllMarketsProduct = GetValue<bool>("AddAllMarketsProduct");
            AssetName = GetValue<string>("AssetName");
            AssetType = GetValue<string>("AssetType");
            CheckForOutRightEvent = GetValue<bool>("CheckForOutRightEvent");
            ContentMediaType = GetValue<DocumentId>("ContentMediaType");
            Markets = GetValue<string>("Markets");
            TargetLink = GetValue<DocumentId>("TargetLink");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Tabs", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class TabsDocument : Frontend.Vanilla.Content.Document,ITabs
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: true)]
        public string Title { get; }

        public TabsDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Image = GetValue<ContentImage>("Image");
            Title = GetValue<string>("Title");
        }
    }

    [Frontend.Vanilla.Content.Templates.Mapping.SitecoreTemplate("TradingTemplates", typeof(Frontend.Gantry.Shared.Content.ContentMappingProfile))]
    [GeneratedCodeAttribute("Frontend.Vanilla.Content.CodeGenerator", "19.0.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class TradingTemplatesDocument : Frontend.Vanilla.Content.Document,ITradingTemplates
    {
        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("ContentMediaType", "Droplink", shared: true)]
        public DocumentId ContentMediaType { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("DragAndDropAssetName", "Single-Line Text", shared: true)]
        public string DragAndDropAssetName { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("MarketNames", "Single-Line Text", shared: true)]
        public string MarketNames { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TargetLink", "Droptree", shared: true)]
        public DocumentId TargetLink { get; }

        [Frontend.Vanilla.Content.Templates.Mapping.SitecoreField("TemplateIds", "Single-Line Text", shared: true)]
        public string TemplateIds { get; }

        public TradingTemplatesDocument(Frontend.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ContentMediaType = GetValue<DocumentId>("ContentMediaType");
            DragAndDropAssetName = GetValue<string>("DragAndDropAssetName");
            MarketNames = GetValue<string>("MarketNames");
            TargetLink = GetValue<DocumentId>("TargetLink");
            TemplateIds = GetValue<string>("TemplateIds");
        }
    }
}
#pragma warning restore 1591
