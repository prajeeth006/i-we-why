using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Host.Features.SiteRootFiles;

/// <summary>
/// Configuration for single content type of <see cref="IStaticFilesOptions"/>.
/// </summary>
public sealed class StaticFileContentType
{
    /// <summary>The name of the content type (e.g. application/json).</summary>
    public string Name { get; set; }

    /// <summary>
    /// Whether to serve the file of this type for everyone, or only internal requests.
    /// </summary>
    public bool IsRestrictedToInternalRequest { get; }

    /// <summary>Creates a new instance.</summary>
    public StaticFileContentType(string name, bool isRestrictedToInternalRequest = false)
    {
        Name = name;
        IsRestrictedToInternalRequest = isRestrictedToInternalRequest;
    }
}

/// <summary>
/// Implementation of <see cref="IStaticFilesOptions" />.
/// </summary>
public static class StaticFilesOptions
{
    private static ContentTypesDictionary contentTypes = new ()
    {
        { ".js", new StaticFileContentType("text/javascript") },
        { ".map", new StaticFileContentType("application/json", isRestrictedToInternalRequest: true) },
        { ".json", new StaticFileContentType("application/json") },
        { ".css", new StaticFileContentType("text/css") },
        { ".jpg", new StaticFileContentType("image/jpeg") },
        { ".jpeg", new StaticFileContentType("image/jpeg") },
        { ".gif", new StaticFileContentType("image/gif") },
        { ".png", new StaticFileContentType("image/png") },
        { ".webp", new StaticFileContentType("image/webp") },
        { ".svg", new StaticFileContentType("image/svg+xml") },
        { ".ico", new StaticFileContentType("image/vnd.microsoft.icon") },
        { ".swf", new StaticFileContentType("application/x-shockwave-flash") },
        { ".html", new StaticFileContentType("text/html") },
        { ".htc", new StaticFileContentType("text/x-component") },
        { ".xml", new StaticFileContentType("application/xml") },
        { ".mp3", new StaticFileContentType("audio/mpeg") },
        { ".txt", new StaticFileContentType("text/plain") },
        { ".woff", new StaticFileContentType("application/font-woff") },
        { ".woff2", new StaticFileContentType("application/font-woff2") },
        { ".eot", new StaticFileContentType("application/vnd.ms-fontobject") },
        { ".otf", new StaticFileContentType("application/x-font-opentype") },
        { ".ttf", new StaticFileContentType("application/x-font-truetype") },
        { ".ani", new StaticFileContentType("application/x-navi-animation") },
    };

    /// <summary>Used to configure mapping of files extensions to content types that can be served as static files.</summary>
    public static IDictionary<string, StaticFileContentType> ContentTypes => contentTypes;

    private sealed class ContentTypesDictionary()
        : DictionaryBase<string, StaticFileContentType>(new Dictionary<string, StaticFileContentType>(StringComparer.OrdinalIgnoreCase))
    {
        public override void ValidateItem(string key, StaticFileContentType value)
        {
            if (string.IsNullOrWhiteSpace(value?.Name))
                throw new ArgumentException(
                    $"Content type for file extension '{key}' can't be null nor white-space. To block particular extension just don't put it in this dictionary.");

            if (!Regex.IsMatch(key ?? string.Empty, @"^\.[^\.\s]+$"))
                throw new ArgumentException($"Invalid file extension '{key}' for content type '{value.Name}'.");
        }
    }
}
