using System;
using System.ComponentModel;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Provides extension methods for enumerations.
/// </summary>
public static class EnumExtensions
{
    /// <summary>Returns an indication whether given value exists in enumeration type.</summary>
    public static bool IsDefinedEnum<T>(this T value)
        where T : Enum
        => Enum<T>.Values.Contains(value);

    /// <summary>Determines if given value is combination of flags defined in particular enumeration type.</summary>
    public static bool IsCombinationOfDefinedFlags<T>(this T value)
        where T : Enum
        => Enum<T>.FlagCombinations.Contains(value);

    internal static T RemoveFlag<T>(this T value, T flagToRemove)
        where T : Enum
    {
        var intValue = value.ToInt32();
        var intFlagToRemove = flagToRemove.ToInt32();

        return (intValue & intFlagToRemove) != 0
            ? (T)(object)(intValue & ~intFlagToRemove) // Set bits of the flag to zero
            : value;
    }

    internal static InvalidEnumArgumentException GetInvalidException<T>(this T value)
        where T : Enum
        => new InvalidEnumArgumentException(
            $"Value '{value}' is invalid (most likely not defined) enum value of {typeof(T)} for particular parameter (see stack trace).");
}
