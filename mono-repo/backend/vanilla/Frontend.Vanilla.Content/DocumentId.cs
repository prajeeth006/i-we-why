#nullable enable

using System;
using System.Globalization;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Identifier for a Document that represents an item in the underlying CMS.
/// </summary>
public sealed class DocumentId : ToStringEquatable<DocumentId>
{
    /// <summary>Gets the ID of the document.</summary>
    public string? Id { get; } // TODO: make it non-nullable in next major version.

    /// <summary>Gets the relative URI of the document. Always starts with a slash and has no trailing slash.</summary>
    public string Path { get; }

    /// <summary>Gets the culture of the document.</summary>
    public CultureInfo Culture { get; }

    /// <summary>Gets a flag indicating relativity of <see cref="Path" />.</summary>
    public DocumentPathRelativity PathRelativity { get; }

    private string? itemName;

    /// <summary>Gets last part of the document path (e.g. App-v1.0/Folder/<c>ItemName</c>). Note: Item name is always lower case.</summary>
    public string ItemName
        => itemName ?? (itemName = System.IO.Path.GetFileName(Path));

    private Wrapper<DocumentId?>? parent;

    /// <summary>Gets <see cref="DocumentId" /> without the last path segment. Gets <see langword="null" /> if <see cref="Path" /> is root.</summary>
    public DocumentId? Parent
        => parent ?? (parent = Path.Length > 1 ? new DocumentId(Path.Substring(0, Path.LastIndexOf('/') + 1), PathRelativity, Culture) : null);

    /// <summary>See <see cref="object.ToString" />.</summary>
    public override string ToString()
    {
        var prefix = PathRelativity == DocumentPathRelativity.AbsoluteRoot ? "(AbsoluteRoot)" : "";

        return $"{prefix}{Path} - {Culture}";
    }

    /// <summary>Initializes a new instance of the <see cref="DocumentId"/> class.</summary>
    public DocumentId(string path, DocumentPathRelativity pathRelativity = DocumentPathRelativity.ConfiguredRootNode, CultureInfo? culture = null, string? id = null)
    {
        Guard.NotWhiteSpace(path, nameof(path));
        Guard.DefinedEnum(pathRelativity, nameof(pathRelativity));

#pragma warning disable SYSLIB0013
        Path = Uri.EscapeUriString("/" + path.Trim('/').ToLowerInvariant());
#pragma warning restore SYSLIB0013
        Culture = CultureInfo.ReadOnly(culture ?? CultureInfo.CurrentCulture);
        PathRelativity = pathRelativity;
        Id = id;
    }

    /// <summary>Creates a <see cref="DocumentId"/> from given relative URI.</summary>
    public static implicit operator DocumentId(string path)
        => new DocumentId(path);

    internal sealed class ToStringJsonConverter : JsonWriteConverter<DocumentId>
    {
        public override void Write(JsonWriter writer, DocumentId value, JsonSerializer serializer)
            => writer.WriteValue(value.ToString());
    }
}

/// <summary>
/// Specifies type of base path to which the content path is relative.
/// </summary>
public enum DocumentPathRelativity
{
    /// <summary>Path is relative to <see cref="ContentConfigurationBuilder.RootNodePath" />.</summary>
    ConfiguredRootNode = 0,

    /// <summary>Path is relative to absolute content root.</summary>
    AbsoluteRoot = 1,
}
