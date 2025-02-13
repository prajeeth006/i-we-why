using System;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

internal sealed class SimpleExceptionConverter : JsonWriteConverter<Exception>
{
    public override void Write(JsonWriter writer, Exception ex, JsonSerializer serializer)
    {
        writer.WriteStartObject();
        writer.WriteProperty("ClassName", ex.GetType().FullName);
        writer.WriteProperty("Message", ex.Message);
        WriteInnerException(writer, ex.InnerException, serializer);
        WriteStackTrace(writer, ex.StackTrace);
        writer.WriteEndObject();
    }

    private void WriteInnerException(JsonWriter writer, Exception? innerEx, JsonSerializer serializer)
    {
        writer.WritePropertyName("InnerException");
        if (innerEx != null)
            Write(writer, innerEx, serializer);
        else
            writer.WriteNull();
    }

    private static void WriteStackTrace(JsonWriter writer, string? stackTrace)
    {
        writer.WritePropertyName("StackTrace");
        writer.WriteStartArray();

        foreach (var line in (stackTrace ?? "").Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries))
            writer.WriteValue(line.Trim());

        writer.WriteEndArray();
    }
}
