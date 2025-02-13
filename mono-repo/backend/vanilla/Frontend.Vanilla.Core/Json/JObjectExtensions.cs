using System;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Core.Json;

/// <summary>
/// Extension method of <see cref="JObject" />.
/// </summary>
internal static class JObjectExtensions
{
    public static TToken? Get<TToken>(this JObject json, string propertyName, StringComparison comparison = StringComparison.Ordinal)
        where TToken : JToken
        => (TToken?)json.GetValue(propertyName, comparison);

    public static TToken GetOrAdd<TToken>(this JObject json, string propertyName, StringComparison comparison = StringComparison.Ordinal)
        where TToken : JToken, new()
    {
        var childJson = json.Get<TToken>(propertyName, comparison);
        if (childJson == null)
            json[propertyName] = childJson = new TToken();

        return childJson;
    }

    public static void Set(this JObject json, string propertyName, StringComparison comparison, JToken value) // There is indexer for Set() without comparison
    {
        json.Remove(propertyName, comparison);
        json.Add(propertyName, value);
    }

    public static void Remove(this JObject json, string propertyName, StringComparison comparison) // There is Remmove() without comparison too
    {
        var propertiesToRemove = json.Properties().Where(p => p.Name.Equals(propertyName, comparison)).ToList(); // Enumerate before removal
        propertiesToRemove.Each(p => p.Remove());
    }
}
