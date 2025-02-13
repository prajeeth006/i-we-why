using System;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters.Abstract;

/// <summary>
/// Base class for generic JSON converters.
/// </summary>
internal abstract class JsonConverterBase<T> : JsonConverterBase
    where T : notnull
{
    public sealed override bool CanConvert(Type objectType)
        => typeof(T).IsAssignableFrom(objectType);

    public sealed override object Read(JsonReader reader, Type typeToRead, object? existingValue, JsonSerializer serializer)
        => Read(reader, typeToRead, serializer);

    public sealed override void Write(JsonWriter writer, object value, JsonSerializer serializer)
        => Write(writer, (T)value, serializer);

    public abstract T Read(JsonReader reader, Type typeToRead, JsonSerializer serializer);
    public abstract void Write(JsonWriter writer, T value, JsonSerializer serializer);
}
