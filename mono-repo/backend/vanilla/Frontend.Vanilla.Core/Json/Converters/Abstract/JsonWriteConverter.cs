using System;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters.Abstract;

/// <summary>
/// Base class for converter meant only for writing objects to JSON.
/// </summary>
internal abstract class JsonWriteConverter : JsonConverterBase
{
    public sealed override bool CanRead => false;

    public sealed override object Read(JsonReader reader, Type objectType, object? existingValue, JsonSerializer serializer)
        => throw new NotSupportedException($"Converter {GetType()} is meant only for writing.");
}
