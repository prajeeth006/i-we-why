using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

/// <summary>
/// Converts a list of key-value pairs to/from a regular dictionary.
/// Especially used in communication with PosAPI.
/// </summary>
internal sealed class KeyValueDictionaryConverter : JsonConverterBase
{
    private static readonly JsonSerializer PascalCaseSerializer = new ();

    public override bool CanConvert(Type type)
        => type.EqualsAny(
            typeof(IReadOnlyDictionary<string, string>),
            typeof(ReadOnlyDictionary<string, string>),
            typeof(IDictionary<string, string>),
            typeof(Dictionary<string, string>));

    public override object? Read(JsonReader reader, Type typeToRead, object? existingValue, JsonSerializer serializer)
    {
        var values = serializer.Deserialize<IEnumerable<KeyValuePair<string, string>>>(reader)
                     ?? throw new VanillaBugException("Deserialized null despite there is some JSON.");

        if (existingValue is IDictionary<string, string> { IsReadOnly: false } existingDict)
        {
            existingDict.Add(values);

            return existingDict;
        }

        return typeToRead.EqualsAny(typeof(IReadOnlyDictionary<string, string>), typeof(ReadOnlyDictionary<string, string>))
            ? values.ToDictionary().AsReadOnly()
            : values.ToDictionary();
    }

    public override void Write(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var pairs = ((IEnumerable<KeyValuePair<string, string>>)value).Select(p => p);
        PascalCaseSerializer.Serialize(writer, pairs);
    }
}
