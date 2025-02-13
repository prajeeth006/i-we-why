#pragma warning disable 1591
#nullable enable
using Bwin.Vanilla.Content.Model;
using System.CodeDom.Compiler;
using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Content
{
    /// <summary>
    /// Interface that maps to the <c>BrandImage</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("BrandImage", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IBrandImage : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>BrandImage</c> content field.
        /// </summary>
        ContentImage? BrandImage { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Cricket</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Cricket", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ICricket : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>BackgroundImage</c> content field.
        /// </summary>
        ContentImage? BackgroundImage { get; }

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
    /// Interface that maps to the <c>GantryConfigItem</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigItem", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGantryConfigItem : Bwin.Vanilla.Content.IDocument
    {
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
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigMultiViewItem", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGantryConfigMultiViewItem : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>TargetingConfiguration</c> content field.
        /// </summary>
        string? TargetingConfiguration { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>MultiEventListItem</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MultiEventList", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IMultiEventList : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>EventList</c> content field.
        /// </summary>
        string? EventList { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>GreyHoundImages</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GreyHoundImages", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IGreyHoundImages : Bwin.Vanilla.Content.IDocument
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
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LabelUrl", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ILabelUrl : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>SmartLink</c> content field.
        /// </summary>
        ContentLink? SmartLink { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>ScreensInDisplayManager</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreensInDisplayManager", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IScreensInDisplayManager : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>ScreenLayout</c> content field.
        /// </summary>
        string? ScreenLayout { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>SportsChannels</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsChannels", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISportsChannels : Bwin.Vanilla.Content.IDocument
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
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsEvent", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ISportsEvent : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>Content</c> content field.
        /// </summary>
        ContentParameters Content { get; }

        /// <summary> 
        /// Property that maps to the <c>RacingPostImage</c> content field.
        /// </summary>
        ContentImage? RacingPostImage { get; }

        ContentImage? RacingPostImageFull { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Standard</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Standard", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface IStandard : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>Markets</c> content field.
        /// </summary>
        string? Markets { get; }
    }

    /// <summary>
    /// Interface that maps to the <c>Tabs</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Tabs", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ITabs : Bwin.Vanilla.Content.IDocument
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
    /// Interface that maps to the <c>TargettingInfo</c> content template.
    /// </summary>
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("TargettingInfo", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    public interface ITargettingInfo : Bwin.Vanilla.Content.IDocument
    {
        /// <summary> 
        /// Property that maps to the <c>TargetingConfiguration</c> content field.
        /// </summary>
        IReadOnlyList<ProxyRule> TargetingConfiguration { get; }
    }
    
    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("BrandImage", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class BrandImageDocument : Bwin.Vanilla.Content.Document, IBrandImage
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("BrandImage", "Image", shared: true)]
        public ContentImage BrandImage { get; }

        public BrandImageDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BrandImage = GetValue<ContentImage>("BrandImage");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Cricket", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class CricketDocument : Bwin.Vanilla.Content.Document, ICricket
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("BackgroundImage", "Image", shared: true)]
        public ContentImage BackgroundImage { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Description", "Rich Text", shared: false)]
        public string Description { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("ForegroundImage", "Image", shared: true)]
        public ContentImage ForegroundImage { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: false)]
        public string Title { get; }

        public CricketDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            BackgroundImage = GetValue<ContentImage>("BackgroundImage");
            Description = GetValue<string>("Description");
            ForegroundImage = GetValue<ContentImage>("ForegroundImage");
            Title = GetValue<string>("Title");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigItem", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GantryConfigItemDocument : Bwin.Vanilla.Content.Document, IGantryConfigItem
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "BwinTable", shared: true)]
        public string Content { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("TargetingConfiguration", "Rules", shared: true)]
        public string TargetingConfiguration { get; }

        public GantryConfigItemDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Content = GetValue<string>("Content");
            TargetingConfiguration = GetValue<string>("TargetingConfiguration");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GantryConfigMultiViewItem", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GantryConfigMultiViewItemDocument : Bwin.Vanilla.Content.Document, IGantryConfigMultiViewItem
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("TargetingConfiguration", "Rules", shared: true)]
        public string TargetingConfiguration { get; }

        public GantryConfigMultiViewItemDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            TargetingConfiguration = GetValue<string>("TargetingConfiguration");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("GreyHoundImages", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GreyHoundImagesDocument : Bwin.Vanilla.Content.Document, IGreyHoundImages
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerEight", "Image", shared: true)]
        public ContentImage RunnerEight { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerFive", "Image", shared: true)]
        public ContentImage RunnerFive { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerFour", "Image", shared: true)]
        public ContentImage RunnerFour { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerNine", "Image", shared: true)]
        public ContentImage RunnerNine { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerOne", "Image", shared: true)]
        public ContentImage RunnerOne { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerSeven", "Image", shared: true)]
        public ContentImage RunnerSeven { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerSix", "Image", shared: true)]
        public ContentImage RunnerSix { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerTen", "Image", shared: true)]
        public ContentImage RunnerTen { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerThree", "Image", shared: true)]
        public ContentImage RunnerThree { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RunnerTwo", "Image", shared: true)]
        public ContentImage RunnerTwo { get; }

        public GreyHoundImagesDocument(Bwin.Vanilla.Content.DocumentData data)
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

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("LabelUrl", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class LabelUrlDocument : Bwin.Vanilla.Content.Document, ILabelUrl
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("SmartLink", "SmartLink", shared: true)]
        public ContentLink SmartLink { get; }

        public LabelUrlDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            SmartLink = GetValue<ContentLink>("SmartLink");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("ScreensInDisplayManager", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class ScreensInDisplayManagerDocument : Bwin.Vanilla.Content.Document, IScreensInDisplayManager
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("ScreenLayout", "JsonField", shared: true)]
        public string ScreenLayout { get; }

        public ScreensInDisplayManagerDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ScreenLayout = GetValue<string>("ScreenLayout");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsChannels", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SportsChannelsDocument : Bwin.Vanilla.Content.Document, ISportsChannels
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("ChannelId", "Single-Line Text", shared: true)]
        public string ChannelId { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("ChannelName", "Single-Line Text", shared: true)]
        public string ChannelName { get; }

        public SportsChannelsDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            ChannelId = GetValue<string>("ChannelId");
            ChannelName = GetValue<string>("ChannelName");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("SportsEvent", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class SportsEventDocument : Bwin.Vanilla.Content.Document, ISportsEvent
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Content", "Bwin Name Value List Sorted", shared: false)]
        public ContentParameters Content { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RacingPostImage", "Image", shared: true)]
        public ContentImage RacingPostImage { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("RacingPostImageFull", "Image", shared: true)]
        public ContentImage RacingPostImageFull { get; }

        public SportsEventDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Content = GetValue<ContentParameters>("Content");
            RacingPostImage = GetValue<ContentImage>("RacingPostImage");
            RacingPostImageFull = GetValue<ContentImage>("RacingPostImageFull");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Standard", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class StandardDocument : Bwin.Vanilla.Content.Document, IStandard
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Markets", "Single-Line Text", shared: true)]
        public string Markets { get; }

        public StandardDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Markets = GetValue<string>("Markets");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("Tabs", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class TabsDocument : Bwin.Vanilla.Content.Document, ITabs
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Image", "Image", shared: true)]
        public ContentImage Image { get; }

        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("Title", "Single-Line Text", shared: true)]
        public string Title { get; }

        public TabsDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            Image = GetValue<ContentImage>("Image");
            Title = GetValue<string>("Title");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("TargettingInfo", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class TargettingInfoDocument : Bwin.Vanilla.Content.Document, ITargettingInfo
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("TargetingConfiguration", "Rules", shared: true)]
        public IReadOnlyList<ProxyRule> TargetingConfiguration { get; }

        public TargettingInfoDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            TargetingConfiguration = GetValue<IReadOnlyList<ProxyRule>>("TargetingConfiguration");
        }
    }

    [Bwin.Vanilla.Content.Templates.Mapping.SitecoreTemplate("MultiEventList", typeof(ContentMappingProfile))]
    [GeneratedCodeAttribute("Bwin.Vanilla.Content.CodeGenerator", "11.4.0.0")]
    [Bwin.SCM.NCover.NCoverExcludeAttribute]
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
    internal sealed partial class GantryConfigMultiEventItemDocument : Bwin.Vanilla.Content.Document, IMultiEventList
    {
        [Bwin.Vanilla.Content.Templates.Mapping.SitecoreField("EventList", "JsonField", shared: true)]
        public string EventList { get; }

        public GantryConfigMultiEventItemDocument(Bwin.Vanilla.Content.DocumentData data)
            : base(data)
        {
            EventList = GetValue<string>("EventList");
        }
    }
}
#pragma warning restore 1591
