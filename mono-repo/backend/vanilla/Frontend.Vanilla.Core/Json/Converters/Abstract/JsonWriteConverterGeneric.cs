using System;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters.Abstract;

/// <summary>
/// Base class for converter meant only for writing objects of particular type to JSON.
/// </summary>
internal abstract class JsonWriteConverter<T> : JsonWriteConverter
    where T : class
{
    public sealed override bool CanConvert(Type objectType)
        => typeof(T).IsAssignableFrom(objectType);

    public sealed override void Write(JsonWriter writer, object value, JsonSerializer serializer)
        => Write(writer, (T)value, serializer);

    public abstract void Write(JsonWriter writer, T value, JsonSerializer serializer);
}
