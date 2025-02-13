using System;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters.Abstract;

/// <summary>
/// Base class for converter meant only for reading objects from JSON.
/// </summary>
internal abstract class JsonReadConverter : JsonConverterBase
{
    public sealed override bool CanWrite => false;

    public sealed override void Write(JsonWriter writer, object value, JsonSerializer serializer)
        => throw new NotSupportedException($"Converter {GetType()} is meant only for reading.");
}
