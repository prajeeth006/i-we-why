using System;
using System.IO;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.IO;

/// <summary>Base class which guarantees that the path contains only valid chars.</summary>
public abstract class FileSystemPath : TrimmedRequiredString
{
    private static readonly ReadOnlySet<char> InvalidChars = Path.GetInvalidPathChars().ToHashSet().AsReadOnly();

    private protected new static string? GetInvalidReason(string value)
    {
        if (TrimmedRequiredString.GetInvalidReason(value) is string baseReason) return baseReason;

        var invalidChars = value.Where(InvalidChars.Contains).ToList();

        return invalidChars.Count > 0 ? $"contains invalid characters: {invalidChars.Dump()}" : null;
    }

    /// <summary>Used by inherited classes to execute the validation only once and with comprehensive error message.</summary>
    private protected FileSystemPath(string value, Func<string, string?> getInvalidReason, string mustBe)
        : base(value, getInvalidReason, mustBe) { }

    private protected T Combine<T>(string?[] relativePaths, Func<string, T> createResult)
    {
        var builder = Value;
        foreach (var relativePath in relativePaths.WhereNotNull())
            builder = Path.Combine(builder, relativePath);

        return createResult(builder);
    }
}

/// <summary>Represents rooted file system path e.g. "C:/dir/file.txt".</summary>
public sealed class RootedPath : FileSystemPath
{
    /// <summary>Message.</summary>
    public const string MustBe = "a valid rooted (absolute) file system path";

    internal new static string? GetInvalidReason(string value)
        => FileSystemPath.GetInvalidReason(value)
           ?? (!Path.IsPathRooted(value) ? "isn't rooted" : null);

    /// <summary>
    /// Initializes a new instance of the <see cref="RootedPath"/> class.
    /// </summary>
    /// <param name="value"></param>
    public RootedPath(string value)
        : base(value, GetInvalidReason, MustBe) { }

    /// <summary>
    /// Combines with instance of the <see cref="RootedPath"/> class.
    /// </summary>
    /// <param name="relativePaths"></param>
    public RootedPath Combine(params string?[] relativePaths)
        => Combine(relativePaths, v => new RootedPath(v));
}

/// <summary>Represents relative file system path e.g. "dir/file.txt".</summary>
internal sealed class RelativePath(string value) : FileSystemPath(value, GetInvalidReason, mustBe: "a valid relative file system path")
{
    private new static string? GetInvalidReason(string value)
        => FileSystemPath.GetInvalidReason(value)
           ?? (Path.IsPathRooted(value) ? "is rooted" : null)
           ?? (value[0] == '~' ? "stars with a tilde (usually web-relative path)" : null);

    public RelativePath Combine(params string?[] relativePaths)
        => Combine(relativePaths, v => new RelativePath(v));
}
