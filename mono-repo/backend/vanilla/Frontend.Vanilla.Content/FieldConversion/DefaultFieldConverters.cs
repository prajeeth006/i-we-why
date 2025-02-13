#nullable enable

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.FieldConversion;

/// <summary>
/// Default converters for <see cref="DefaultTemplateMappingProfile" />.
/// </summary>
public sealed class DefaultFieldConverters
{
    /// <summary>Represents the default parser for Bwin name-value collections. </summary>
    public static readonly IBwinNameValueCollectionParser BwinCollectionParser = new BwinNameValueCollectionParser();

    internal DefaultFieldConverters() { } // Only Vanilla can create it

    /// <summary>Gets the default converter for fields of type <see cref="string" />.</summary>
    public IFieldConverter<string?> String { get; } = new StringConverter();

    /// <summary>Gets the default converter for fields of type <see cref="bool" />.</summary>
    public IFieldConverter<bool> Bool { get; } = new BoolConverter();

    /// <summary>Gets the default converter for fields of type <see cref="int" />.</summary>
    public IFieldConverter<int> Int { get; } = new IntConverter();

    /// <summary>Gets the default converter for fields of type <see cref="UtcDateTime" />.</summary>
    public IFieldConverter<UtcDateTime> DateTime { get; } = new DateTimeConverter();

    /// <summary>Gets the default converter for fields of type <see cref="Content.DocumentId" />.</summary>
    public IFieldConverter<DocumentId?> DocumentId { get; } = new DocumentIdConverter();

    /// <summary>Gets the default converter for fields of type <see cref="ContentImage" />.</summary>
    public IFieldConverter<ContentImage?> ContentImage { get; } = new ContentImageConverter();

    /// <summary>Gets the default converter for fields of type <see cref="Model.ContentVideo" />.</summary>
    public IFieldConverter<ContentVideo?> ContentVideo { get; } = new ContentVideoConverter();

    /// <summary>Gets the default converter for fields of type <see cref="Model.ContentLink" />.</summary>
    public IFieldConverter<ContentLink?> ContentLink { get; } = new ContentLinkConverter();

    /// <summary>Gets the default converter for fields of type <see cref="NameValueCollection" /> serialized using custom BWIN XML format.</summary>
    public IFieldConverter<ContentParameters> BwinNameValueCollection { get; } = new BwinNameValueCollectionConverter(BwinCollectionParser);

    /// <summary>Gets the default converter for fields of type <see cref="IReadOnlyList{DocumentId}" />.</summary>
    public IFieldConverter<IReadOnlyList<DocumentId>> DocumentIdList { get; } = new DocumentIdCollectionConverter();

    internal IFieldConverter<IReadOnlyList<ProxyRule>> ProxyRules { get; } = new ProxyRulesConverter();
    internal IFieldConverter<IReadOnlyList<ListItem>> ListItems { get; } = new ListItemConverter(BwinCollectionParser);
    internal IFieldConverter<IReadOnlyList<KeyValuePair<string, DocumentId>>> RegionItems { get; } = new RegionItemsConverter(BwinCollectionParser);
    internal IFieldConverter<Uri?> LinkTemplateUrl { get; } = new LinkTemplateUrlConverter();
}
