using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json;

internal static class JsonWriterExtensions
{
    internal static void WriteProperty(this JsonWriter writer, TrimmedRequiredString propertyName, object? value)
    {
        writer.WritePropertyName(propertyName);
        writer.WriteValue(value);
    }

    internal static void WriteClientProperty(this JsonWriter writer, TrimmedRequiredString propertyName, object value)
    {
        if (value != null && !(value is string str && string.IsNullOrEmpty(str)))
            writer.WriteProperty(propertyName.Value.ToCamelCase(), value);
    }
}
