#nullable enable

using System;
using System.Globalization;
using System.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Creates <see cref="DocumentId" /> obtained from underlying CMS.
/// </summary>
public interface IDocumentIdFactory
{
    /// <summary>
    /// Creates <see cref="DocumentId" /> from id and path obtained from underlying CMS.
    /// Path is converted according to <see cref="IContentConfiguration.RootNodePath" />.
    /// </summary>
    /// <param name="pathFromCms">The document path obtained from underlying CMS.</param>
    /// <param name="culture">The culture.</param>
    /// <param name="idFromCms">The document id obtained from underlying CMS.</param>
    /// <returns>New instance of <see cref="DocumentId" />.</returns>
    DocumentId Create(RequiredString pathFromCms, CultureInfo culture, string? idFromCms = null);
}

internal sealed class SitecoreDocumentIdFactory(IContentConfiguration config) : IDocumentIdFactory
{
    public DocumentId Create(RequiredString pathFromCms, CultureInfo culture, string? idFromCms = null)
    {
        Guard.NotNull(pathFromCms, nameof(pathFromCms));
        Guard.NotNull(culture, nameof(culture));

        var rootNodePath = config.RootNodePath.Trim('/');
        var pathRelativity = DocumentPathRelativity.AbsoluteRoot;
        var path = pathFromCms.Value.Trim().Trim('/');

        if (path.StartsWith(rootNodePath, StringComparison.OrdinalIgnoreCase))
        {
            path = path.Substring(rootNodePath.Length);
            pathRelativity = DocumentPathRelativity.ConfiguredRootNode;
        }

        var stripPath =
            config.StrippedPaths.FirstOrDefault(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase));

        if (stripPath != null)
        {
            path = path.Substring(stripPath.Length);
            pathRelativity = DocumentPathRelativity.ConfiguredRootNode;
        }

        path = !string.IsNullOrWhiteSpace(path) ? path : "/";

        return new DocumentId(path, pathRelativity, culture, idFromCms);
    }
}
