using System.IO;
using Serilog.Events;
using Serilog.Formatting.Json;

namespace Frontend.Vanilla.Features.Logging;

internal sealed class SimpleJsonWriter(TextWriter output, JsonValueFormatter valueFormatter)
{
    private bool wasObjectStart;

    public void StartObject()
    {
        output.Write('{');
        wasObjectStart = true;
    }

    public void EndObject()
        => output.Write('}');

    public void WritePropertyName(string name)
    {
        if (!wasObjectStart) output.Write(',');
        wasObjectStart = false;

        JsonValueFormatter.WriteQuotedJsonString(name, output);
        output.Write(':');
    }

    public void WriteProperty(string name, string? value)
    {
        WritePropertyName(name);

        if (value != null)
            JsonValueFormatter.WriteQuotedJsonString(value, output);
        else
            output.Write("null");
    }

    public void WriteProperty(string name, LogEventPropertyValue value)
    {
        WritePropertyName(name);
        valueFormatter.Format(value, output);
    }
}
