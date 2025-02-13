using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.FieldConversion.Converters;

namespace Frontend.Vanilla.Content.Templates.Mapping;

/// <summary>
/// Defines mappings for base vanilla templates. Mappings can be customized by overriding <see cref="OnMap" /> method.
/// See <see cref="TemplateMappingProfile" /> for more details.
/// </summary>
/// <remarks>
/// <code>
/// <![CDATA[
/// // Avoid doing this in your mapping profile class, because the code below maps all fields called "fieldName",
/// // regardless of the template they're defined in.
/// MapField<TField>("fieldName");
///
/// // Instead, do this, configuring fields only for templates you own or control.
/// MapTemplate("My Template Name", template => {
///     template.MapField<TField>("myFieldName");
/// });
/// ]]>
/// </code>
/// </remarks>
public class DefaultTemplateMappingProfile : TemplateMappingProfile
{
    /// <summary>Gets injected dependencies.</summary>
    protected DefaultFieldConverters Converters { get; }

    /// <summary>Creates a new instance.</summary>
    public DefaultTemplateMappingProfile()
        => Converters = new DefaultFieldConverters();

    /// <summary>Defines the actual mapping.</summary>
    protected override void OnMap()
    {
        MapFieldsOfType("CheckBox", Converters.Bool);
        MapFieldsOfType("Integer", Converters.Int);
        MapFieldsOfType("Date", Converters.DateTime);
        MapFieldsOfType("DateTime", Converters.DateTime);

        MapFieldsOfType("Html", Converters.String);
        MapFieldsOfType("Checklist", Converters.String);
        MapFieldsOfType("Rich Text", Converters.String);
        MapFieldsOfType("Memo", Converters.String);
        MapFieldsOfType("Password", Converters.String);
        MapFieldsOfType("Text", Converters.String);
        MapFieldsOfType("Single-Line Text", Converters.String);
        MapFieldsOfType("Multi-Line Text", Converters.String);
        MapFieldsOfType("Json", Converters.String);
        MapFieldsOfType("File", Converters.String);
        MapFieldsOfType("Name Value List", Converters.String);

        MapFieldsOfType("DropLink", Converters.DocumentId);
        MapFieldsOfType("DropTree", Converters.DocumentId);

        MapFieldsOfType("Image", Converters.ContentImage);
        MapFieldsOfType("General Link", Converters.ContentLink);
        MapFieldsOfType("BwinLink", Converters.ContentLink);
        MapFieldsOfType("SmartLink", Converters.ContentLink);
        MapFieldsOfType("BwinVideo", Converters.ContentVideo);

        MapFieldsOfType("Bwin Name Value List Sorted", Converters.BwinNameValueCollection);
        MapFieldsOfType("Bwin Name Value List Unsorted", Converters.BwinNameValueCollection);

        MapFieldsOfType("TreeList", Converters.DocumentIdList);
        MapFieldsOfType("TreeListEx", Converters.DocumentIdList);
        MapFieldsOfType("RelativeTreeList", Converters.DocumentIdList);
        MapFieldsOfType("Rules", Converters.ProxyRules);

        MapTemplate("Form Element Template", t => { t.MapField("Values", Converters.ListItems); });
        MapTemplate("PCRegionalComponent", t => { t.MapField("RegionItems", Converters.RegionItems); });
        MapTemplate("LinkTemplate", t =>
        {
            t.IgnoreField(LinkTemplateUrlConverter.Fields.LocalizedUrl);
            t.MapField(LinkTemplateUrlConverter.Fields.Url, Converters.LinkTemplateUrl);
        });
        MapTemplate("View Template", t => { t.IgnoreField("PageKeywords"); });
        MapTemplate("PMBasePage", t => { t.IgnoreField("PageKeywords"); });
        IgnoreTemplate("Base Tracking");
        MapFieldsOfType("Droplist", Converters.String);
        MapFieldsOfType("BwinJson", Converters.String);
    }
}
