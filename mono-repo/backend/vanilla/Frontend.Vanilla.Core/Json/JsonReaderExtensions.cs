using System;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json;

internal static class JsonReaderExtensions
{
    internal static T GetRequiredValue<T>(this JsonReader reader)
    {
        if (reader.Value == null)
        {
            throw new ArgumentNullException(nameof(reader.Value));
        }

        return (T)reader.Value;
    }
}
