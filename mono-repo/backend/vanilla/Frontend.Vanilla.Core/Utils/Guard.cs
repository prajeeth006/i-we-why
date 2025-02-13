using System;
using System.Collections;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.Utils;

/// <summary>
/// A helper class containing for parameter checking.
/// </summary>
public static class Guard
{
    /// <summary>Throws <see cref="ArgumentNullException" /> an exception if <paramref name="value" /> is null.</summary>
    [return: NotNull]
    public static T NotNull<T>(T value, string paramName, string? message = null)
        => value != null
            ? value
            : throw new ArgumentNullException(paramName, message ?? "Value cannot be null.");

    /// <summary>Throws <see cref="ArgumentNullException" /> if <paramref name="value" /> is null or empty string.</summary>
    public static string NotEmpty(string? value, string paramName, string? message = null)
        => !value.IsNullOrEmpty()
            ? value
            : throw new ArgumentException(message ?? "String cannot be null nor empty.", paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is null or white-space string.</summary>
    public static string NotWhiteSpace(string? value, string paramName, string? message = null)
        => !value.IsNullOrWhiteSpace()
            ? value
            : throw new ArgumentException(message ?? "String cannot be null nor white-space.", paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is null or withespace.</summary>
    internal static TrimmedRequiredString TrimmedRequired(string? value, string paramName, string? message = null)
        => TrimmedRequiredString.TryCreate(value)
           ?? throw new ArgumentException(message ?? "Value must be a trimmed non-empty string.", paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if collection <paramref name="value" /> is null or does not contain any item.</summary>
    [return: NotNull]
    public static T NotEmpty<T>(T value, string paramName, string? message = null)
        where T : IEnumerable
        => value?.GetEnumerator().MoveNext() == true
            ? value
            : throw new ArgumentException(message ?? "Collection cannot be null nor empty.", paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if collection <paramref name="value" /> is null or contains null item.</summary>
    [return: NotNull]
    internal static T NotNullItems<T>(T value, string paramName, string? message = null)
        where T : IEnumerable?
        => value != null && !value.Cast<object?>().Contains(null)
            ? value
            : throw new ArgumentException(message ?? "Collection cannot be null nor contain null item(s).", paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if collection <paramref name="value" /> is null or empty or contains null item.</summary>
    [return: NotNull]
    internal static T NotEmptyNorNullItems<T>(T value, string paramName, string? message = null)
        where T : IEnumerable?
    {
        var count = 0;

        return value != null && value.Cast<object?>().All(x => x != null && ++count > 0) && count > 0
            ? value
            : throw new ArgumentException(message ?? "Collection cannot be null, empty nor contain null item(s).", paramName);
    }

    /// <summary>Throws <see cref="ArgumentException" /> if dictionary <paramref name="value" /> is null or contains null in its <see cref="IDictionary.Values" />.</summary>
    [return: NotNull]
    [DebuggerStepThrough, MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static T NotNullValues<T>(T value, string paramName, string? message = null)
        where T : IDictionary
        => value != null && !value.Values.Cast<object?>().Contains(null)
            ? value
            : throw new ArgumentException(message ?? "Dictionary cannot be null nor contain null in its Values.", paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if dictionary <paramref name="value" /> is null or empty or contains null in its <see cref="IDictionary.Values" />.</summary>
    [return: NotNull]
    internal static T NotEmptyNorNullValues<T>(T value, string paramName, string? message = null)
        where T : IDictionary
    {
        var count = 0;

        return value != null && value.Values.Cast<object>().All(x => x != null && ++count > 0) && count > 0
            ? value
            : throw new ArgumentException(message ?? "Dictionary cannot be null, empty nor contain null in its Values.", paramName);
    }

    /// <summary>Throws <see cref="ArgumentOutOfRangeException" /> if <paramref name="value" /> is not greater than the supplied boundary.</summary>
    [DebuggerStepThrough, MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static T Greater<T>(T? value, T boundary, string paramName, string? message = null)
        where T : struct, IComparable
        => value?.CompareTo(boundary) > 0
            ? value.Value
            : throw new ArgumentOutOfRangeException(paramName, AppendActual(message ?? $"Value must be greater than {boundary}.", value));

    /// <summary>Throws <see cref="ArgumentOutOfRangeException" /> if <paramref name="value" /> is not greater than nor equal to the supplied boundary.</summary>
    public static T GreaterOrEqual<T>(T? value, T boundary, string paramName, string? message = null)
        where T : struct, IComparable
        => value?.CompareTo(boundary) >= 0
            ? value.Value
            : throw new ArgumentOutOfRangeException(paramName, AppendActual(message ?? $"Value must be greater than or equal to {boundary}.", value));

    /// <summary>Throws <see cref="ArgumentOutOfRangeException" /> if <paramref name="value" /> is not less than the supplied boundary.</summary>
    public static T Less<T>(T? value, T boundary, string paramName, string? message = null)
        where T : struct, IComparable
        => value?.CompareTo(boundary) < 0
            ? value.Value
            : throw new ArgumentOutOfRangeException(paramName, AppendActual(message ?? $"Value must be less than {boundary}.", value));

    /// <summary>Throws <see cref="ArgumentOutOfRangeException" /> if <paramref name="value" /> is not less than nor equal to the supplied boundary.</summary>
    public static T LessOrEqual<T>(T? value, T boundary, string paramName, string? message = null)
        where T : struct, IComparable?
        => value?.CompareTo(boundary) <= 0
            ? value.Value
            : throw new ArgumentOutOfRangeException(paramName, AppendActual(message ?? $"Value must be less than or equal to {boundary}.", value));

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is null or not an absolute <see cref="Uri" />.</summary>
    public static Uri AbsoluteUri(Uri? value, string paramName, string? message = null)
        => value?.IsAbsoluteUri == true
            ? value
            : throw new ArgumentException(AppendActual(message ?? "Value must be an absolute Uri.", value), paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is not a defined enum value of <typeparamref name="T" />.</summary>
    public static T DefinedEnum<T>(T value, string paramName, string? message = null)
        where T : Enum
        => value.IsDefinedEnum()
            ? value
            : throw new ArgumentOutOfRangeException(paramName, AppendActual(message ?? GetEnumError<T>("one of defined values of"), value));

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is not a combination of defined values of [Flags] enum <typeparamref name="T" />.</summary>
    internal static T CombinationOfDefinedFlags<T>(T value, string paramName, string? message = null)
        where T : Enum
        => value.IsCombinationOfDefinedFlags()
            ? value
            : throw new ArgumentOutOfRangeException(paramName, AppendActual(message ?? GetEnumError<T>("a combination of defined values of [Flags]"), value));

    private static string GetEnumError<T>(string enumRequirement)
        where T : Enum
        => $"Value must be {enumRequirement} enum {typeof(T)} which are: {Enum<T>.Values.Select(e => $"{e} ({e:D})").Join()}.";

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is null or not a type assignable to <typeparamref name="T" />.</summary>
    public static Type AssignableTo<T>(Type? value, string paramName, string? message = null)
        => value != null && typeof(T).IsAssignableFrom(value)
            ? value
            : throw new ArgumentException(AppendActual(message ?? $"Value must be a type assignable to {typeof(T)}.", value), paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is null or not an interface.</summary>
    public static Type Interface(Type? value, string paramName, string? message = null)
        => value?.IsInterface == true
            ? value
            : throw new ArgumentException(AppendActual(message ?? "Value must be an interface type.", value), paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="value" /> is null or not <see cref="TypeExtensions.IsFinalClass" />.</summary>
    [DebuggerStepThrough, MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static Type FinalClass(Type? value, string paramName, string? message = null)
        => value?.IsFinalClass() == true
            ? value
            : throw new ArgumentException(AppendActual(message ?? "Value must be a final non-abstract class which can be instantiated.", value), paramName);

    /// <summary>Throws <see cref="ArgumentException" /> if <paramref name="condition" /> is not met.</summary>
    /// <exception cref="ArgumentException">Thrown if the condition is not met.</exception>
    [DebuggerStepThrough, MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void Requires([DoesNotReturnIf(false)] bool condition, string paramName, string message)
    {
        if (!condition)
            throw new ArgumentException(message, paramName);
    }

    internal static T NotEqual<T>(T value, T unsupportedValue, string paramName, string? message = null)
        where T : notnull
        => !value.Equals(unsupportedValue)
            ? value
            : throw new ArgumentException(AppendActual(message ?? $"Value must not equal to {unsupportedValue.Dump()} but it does.", value), paramName);

    internal static string SimpleUrlPathSegment(string? value, string paramName, string? message = null)
    {
        const string defaultMessage =
            "Value must contain only lower-case letters, numbers or hyphens and must not start nor end with a hyphen in order to produce nice URLs.";

        return value != null && Regex.IsMatch(value, "^[a-z0-9]([a-z0-9-]*[a-z0-9])?$")
            ? value
            : throw new ArgumentException(AppendActual(message ?? defaultMessage, value), paramName);
    }

    internal static T Requires<T>(T value, Predicate<T> condition, string paramName, string message)
        => condition(value)
            ? value
            : throw new ArgumentException(AppendActual(message, value), paramName);

    internal static string AppendActual(string message, object? value)
        => $"{message}{Environment.NewLine}Actual value: {value.Dump()}";

    internal static void Assert([DoesNotReturnIf(false)] bool condition, string? message = null)
    {
        if (!condition)
            throw new VanillaBugException(message);
    }
}

internal sealed class VanillaBugException(string? message = null) : InvalidOperationException(
    "Impossible, a bug in Vanilla! Please collect ALL details (especially FULL exception) and ask Vanilla developers to fix it."
    + (" " + message).TrimEnd() + " Caller: " + CallerInfo.Get()) { }
