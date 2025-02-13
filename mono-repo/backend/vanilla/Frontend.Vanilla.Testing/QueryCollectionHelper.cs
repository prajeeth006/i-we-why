#nullable enable

using System.Collections.Generic;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Testing;

internal static class QueryCollectionHelper
{
    public static void SetOrRemove(this Dictionary<string, StringValues> query, string key, string? value)
    {
        if (value != null) query[key] = value;
        else query.Remove(key);
    }
}
