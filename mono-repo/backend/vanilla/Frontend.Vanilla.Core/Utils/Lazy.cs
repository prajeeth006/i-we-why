using System;

namespace Frontend.Vanilla.Core.Utils;

internal static class Lazy
{
    public static Lazy<T> ToLazy<T>(this Func<T> valueFactory)
        => new Lazy<T>(valueFactory);
}
