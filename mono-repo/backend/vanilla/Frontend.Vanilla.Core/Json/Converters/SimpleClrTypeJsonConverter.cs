using System;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

internal sealed class SimpleClrTypeJsonConverter : JsonWriteConverter<Type>
{
    public override void Write(JsonWriter writer, Type value, JsonSerializer serializer)
        => writer.WriteValue(value.ToString());
}
