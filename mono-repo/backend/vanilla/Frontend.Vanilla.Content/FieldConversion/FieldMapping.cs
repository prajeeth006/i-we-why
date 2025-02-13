#nullable enable

using System;
using System.Linq;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Content.FieldConversion;

/// <summary>
/// Converts CMS items based on a specific template to the specified type and applies all registered pre- and post-processors.
/// </summary>
[JsonConverter(typeof(FieldMappingJsonConverter))]
internal abstract class FieldMapping(Type clrType, bool isNullableReference, TrimmedRequiredString? obsoleteMessage)
{
    public Type ClrType { get; } = clrType;
    public bool IsNullableReference { get; } = isNullableReference;
    public TrimmedRequiredString? ObsoleteMessage { get; } = obsoleteMessage;

    public abstract object? Convert(IFieldConversionContext context);

    private sealed class FieldMappingJsonConverter : JsonWriteConverter<FieldMapping>
    {
        public override void Write(JsonWriter writer, FieldMapping value, JsonSerializer serializer)
        {
            writer.WriteStartObject();
            writer.WriteProperty(nameof(ClrType), value.ClrType + (value.IsNullableReference ? " (nullable)" : ""));
            writer.WriteProperty(nameof(FieldMapping<object>.Converter), value.ToString());
            if (value.ObsoleteMessage != null) writer.WriteProperty(nameof(ObsoleteMessage), value.ObsoleteMessage);
            writer.WriteEndObject();
        }
    }
}

internal sealed class FieldMapping<TField>(IFieldConverter<TField> converter, TrimmedRequiredString? obsoleteMessage = null)
    : FieldMapping(typeof(TField), DetermineNullableReference(converter), obsoleteMessage)
{
    public IFieldConverter<TField> Converter { get; } = converter;

    public override object? Convert(IFieldConversionContext context)
        => Converter.Convert(context);

    public override string? ToString()
        => Converter.ToString();

    private static bool DetermineNullableReference(IFieldConverter<TField> converter)
    {
        var method = converter.GetType().GetMethod(nameof(IFieldConverter<TField>.Convert));

        if (method == null)
            return false;

        var attribute = method.ReturnTypeCustomAttributes
            .GetCustomAttributes(true)
            .FirstOrDefault(a => a.GetType().FullName == "System.Runtime.CompilerServices.NullableAttribute");

        if (attribute == null)
            return false;

        byte[] flags = ((dynamic)attribute).NullableFlags;

        return flags.Length == 1 & flags[0] == 2;
    }
}
