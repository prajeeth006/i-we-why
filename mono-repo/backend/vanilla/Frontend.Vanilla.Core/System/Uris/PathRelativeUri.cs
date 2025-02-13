using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.System.Uris;

/// <summary>
/// Represents a path-relative URI meaning it's not rooted e.g. 'path/file.txt' but '/rooted.txt' would be invalid.
/// </summary>
public sealed class PathRelativeUri : Uri
{
    internal const string InvalidValueMessage =
        "Path-relative URI must be a trimmed non-empty relative URI not starting with a slash nor backslash e.g. 'path/file.txt'.";

    /// <summary>Creates a new instance.</summary>
    public PathRelativeUri(string uriString)
        : base(Guard.Requires(uriString, IsValid, nameof(uriString), InvalidValueMessage), UriKind.Relative) { }

    /// <summary>Creates a new instance.</summary>
    public PathRelativeUri(Uri uri)
        : this(uri.ToString()) { }

    private static bool IsValid(string uriString)
        => TrimmedRequiredString.IsValid(uriString) && !uriString[0].EqualsAny('/', '\\');
}
