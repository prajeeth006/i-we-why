using System;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

/// <summary>
/// Converts <see cref="StringValues" /> from/to a single string or an array of strings.
/// </summary>
internal sealed class StringValuesJsonConverter : JsonConverterBase<StringValues>
{
    public override StringValues Read(JsonReader reader, Type typeToRead, JsonSerializer serializer)
        => reader.TokenType == JsonToken.StartArray
            ? new StringValues(serializer.Deserialize<string?[]>(reader))
            : new StringValues((string?)reader.Value);

    public override void Write(JsonWriter writer, StringValues value, JsonSerializer serializer)
        => serializer.Serialize(writer, value.Count > 1 ? value.ToArray() : (string?)value);
}
