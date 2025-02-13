#nullable disable
using System.Runtime.Serialization;

namespace Frontend.Vanilla.Features.Games;

[DataContract]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
public class MobileGameInfo
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
{
    [DataMember(Name = "launchUrl")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public string LaunchUrl { get; set; }
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member

    [DataMember(Name = "title")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public string Title
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }

    [DataMember(Name = "icon")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public MobileGameIconInfo Icon
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }

    [DataMember(Name = "gameId")]
    // casino sitecore id
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public string GameId
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }

    [DataMember(Name = "internalGameName")]
    // backend id
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public string InternalGameName
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }

    [DataMember(Name = "categoryTitle")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public string CategoryTitle { get; set; }
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}

[DataContract]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
public class MobileGameIconInfo
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
{
    [DataMember(Name = "src")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public string Src
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }

    [DataMember(Name = "width")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public int? Width
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }

    [DataMember(Name = "height")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public int? Height
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        get;
        set;
    }
}
