using System;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters.Abstract;

/// <summary>
/// Base convenient class for Vanilla <see cref="JsonConverter" />-s.
/// </summary>
internal abstract class JsonConverterBase : JsonConverter
{
    public sealed override object? ReadJson(JsonReader reader, Type typeToRead, object? existingValue, JsonSerializer serializer)
    {
        try
        {
            if (reader.TokenType.EqualsAny(JsonToken.Null, JsonToken.Undefined))
                return typeToRead.CanBeNull()
                    ? null
                    : throw new Exception("Null was deserialized but it can't be used for target type.");

            return Read(reader, typeToRead, existingValue, serializer);
        }
        catch (Exception ex)
        {
            throw new JsonSerializationException($"Failed deserializing {typeToRead} at path '{reader.Path}'.", ex);
        }
    }

    public sealed override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
    {
        Guard.Assert(value != null);

        try
        {
            Write(writer, value, serializer);
        }
        catch (Exception ex)
        {
            throw new JsonSerializationException($"Failed serializing {value.Dump()} of type {value.GetType()} at path '{writer.Path}'.", ex);
        }
    }

    public abstract object? Read(JsonReader reader, Type typeToRead, object? existingValue, JsonSerializer serializer);
    public abstract void Write(JsonWriter writer, object value, JsonSerializer serializer);
}
