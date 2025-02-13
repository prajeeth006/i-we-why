using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Core.Utils;

internal static class VanillaOrdering
{
    /// <summary>Puts items from Vanilla first, then the rest so that product developers can override logic (usually values) those from Vanilla.</summary>
    public static IEnumerable<T> OrderVanillaFirst<T>(this IEnumerable<T> items)
        where T : notnull
        => items.OrderBy(item =>
        {
            var name = item.GetType().Namespace ?? "";

            if (name.StartsWith("Frontend.Vanilla.")) return 0;

            return 2;
        });
}
