#nullable enable

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Content.Loading.XmlSources;

/// <summary>
/// Retrieves raw content XML.
/// </summary>
internal interface IContentXmlSource
{
    Task<ContentXml> GetContentXmlAsync(ExecutionMode mode, HttpUri requestUrl, bool useCache, Action<object>? trace);
}

internal sealed class ContentXml(XElement? xml, TimeSpan relativeExpiration, UtcDateTime sitecoreLoadTime)
{
    public const string RootElement = "items";
    public const string ItemElement = "item";

    public XElement? Xml { get; } = xml == null || (xml.Name.LocalName == RootElement && xml.Elements(ItemElement).Count() == 1)
        ? xml
        : throw new ArgumentException("XML must contain root element <items> with one child <item>.", nameof(xml));

    public TimeSpan RelativeExpiration { get; } = relativeExpiration;
    public UtcDateTime SitecoreLoadTime { get; } = sitecoreLoadTime;
}
