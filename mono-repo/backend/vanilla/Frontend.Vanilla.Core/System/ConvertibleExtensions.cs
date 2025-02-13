using System;
using System.Globalization;

namespace Frontend.Vanilla.Core.System;

internal static class ConvertibleExtensions
{
    public static string ToInvariantString<T>(this T convertible)
        where T : IConvertible // Use generics to avoid boxing value types to an object
        => convertible.ToString(CultureInfo.InvariantCulture);

    public static int ToInt32<T>(this T convertible)
        where T : IConvertible // Use generics to avoid boxing value types to an object
        => convertible.ToInt32(null);
}
