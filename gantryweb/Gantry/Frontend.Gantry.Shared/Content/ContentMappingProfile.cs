using Bwin.Vanilla.Content.Templates.Mapping;
using Bwin.Vanilla.Core.System.Text;

namespace Frontend.Gantry.Shared.Content
{
    /// <summary>
    /// Denotes the type of a <see cref="IPCFormField"/>.
    /// </summary>
    public enum PCFormFieldType
    {
#pragma warning disable 1591
        TextBox,
        DropDownList,
        MultilineTb,
        Date,
        DateTime,
        Checkbox,
        Info,
        RadioButtonList,
        File
#pragma warning restore 1591
    }

    /// <summary>
    /// Defines portal specific mappings for vanilla templates. (Sitecore path: /templates/vanilla/portal)
    /// </summary>
    /// <see cref="T:Bwin.Vanilla.Content.TemplateMappingProfile"/>
    public sealed class ContentMappingProfile : DefaultTemplateMappingProfile
    {
        /// <summary>
        /// Defines the actual mappings.
        /// </summary>
        protected override void OnMap()
        {
            base.OnMap();
            //MapFieldsOfType("Droplist", Converters.String);
            MapFieldsOfType("BwinTable", Converters.String);
            //MapFieldsOfType("", Converters.String);
            //MapFieldsOfType("BwinJson", Converters.String);
            MapFieldsOfType("JsonField", Converters.String);
            MapFieldsOfType("Internal Link", Converters.String);
            MapTemplate("GantryConfigItem", template => template.MapField<string>(new TrimmedRequiredString("targetingconfiguration"), Converters.String));
            MapTemplate("GantryConfigMultiViewItem", template => template.MapField<string>(new TrimmedRequiredString("targetingconfiguration"), Converters.String));
            MapTemplate("MultiEventList", template => template.MapField<string>(new TrimmedRequiredString("eventlist"), Converters.String));
            //MapTemplate("PC Form Field", template => template.MapField<PCFormFieldType>("FieldType", new EnumConverter<PCFormFieldType>()));
            //MapTemplate("vipteaseritem", template => template.MapField<int>("Priority", new Bwin.Vanilla.Content.Converters.IntegerConverter()));
        }
    }
}