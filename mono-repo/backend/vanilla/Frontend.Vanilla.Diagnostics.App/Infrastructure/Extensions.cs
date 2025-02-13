using System;
using System.Collections.Generic;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.App.Infrastructure;

public static class Extensions
{
    public static void Toggle<T>(this ICollection<T> collection, T item)
    {
        if (!collection.Remove(item))
            collection.Add(item);
    }

    public static TToken Get<TToken>(this JObject json, string propertyName)
        where TToken : JToken
        => (TToken)json?.GetValue(propertyName, StringComparison.OrdinalIgnoreCase);

    public static TToken Get<TToken>(this JArray json, int index)
        where TToken : JToken
        => (TToken)json?[index];

    public static string Get(this Dictionary<string, StringValues> queryString, string name)
        => queryString.TryGetValue(name, out var values) ? values.ToString() : null;

    public static string EscapeToHtmlId(this string str)
        => str.Trim().Replace(' ', '_').Replace('#', '_');
}
