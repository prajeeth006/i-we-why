using System;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

/// <summary>
/// Converts value of type <see cref="Regex" /> to/from raw string in JSON.
/// </summary>
internal sealed class RegexStringJsonConverter : JsonConverterBase<Regex>
{
    public override Regex Read(JsonReader reader, Type typeToRead, JsonSerializer serializer)
        => new Regex(reader.GetRequiredValue<string>(), RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public override void Write(JsonWriter writer, Regex value, JsonSerializer serializer)
        => writer.WriteValue(value.ToString());
}
