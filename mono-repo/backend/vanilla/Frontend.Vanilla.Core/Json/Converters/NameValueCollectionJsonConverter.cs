using System.Collections.Specialized;
using System.Linq;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

/// <summary>
/// Converts value of the type <see cref="NameValueCollection"/> to JSON dictionary, where the Name of the collection item
/// is converted to dictionary's key and the Value is concatenated using comma separator and stored as a dictionary's value.
/// </summary>
internal sealed class NameValueCollectionJsonConverter : JsonWriteConverter<NameValueCollection>
{
    public override void Write(JsonWriter writer, NameValueCollection collection, JsonSerializer serializer)
    {
        writer.WriteStartObject();

        foreach (var key in collection.AllKeys.Where(k => k != null))
        {
            writer.WritePropertyName(key!);
            serializer.Serialize(writer, collection[key]);
        }

        writer.WriteEndObject();
    }
}
