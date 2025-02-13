using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Patterns;

/// <summary>Wrapper for some value (usually operation result) with related warnings.</summary>
public sealed class WithWarnings<TValue>
{
    /// <summary>Gets result value.</summary>
    public TValue Value { get; }

    /// <summary>Gets warnings related to the <see cref="Value" />.</summary>
    public IReadOnlyList<TrimmedRequiredString> Warnings { get; }

    /// <summary>Create a new instance.</summary>
    public WithWarnings(TValue value, IEnumerable<TrimmedRequiredString>? warnings = null)
    {
        Value = value;
        Warnings = Guard.NotNullItems((warnings?.ToArray()).NullToEmpty(), nameof(warnings));
    }

    /// <summary>Deconstructs the instance.</summary>
    public void Deconstruct(out TValue value, out IReadOnlyList<TrimmedRequiredString> warnings)
        => (value, warnings) = (Value, Warnings);

    /// <summary>Create a new instance with no warnings.</summary>
    public static implicit operator WithWarnings<TValue>(TValue value)
        => new WithWarnings<TValue>(value);
}

/// <summary>Extension methods.</summary>
public static class WithWarningsExtensions
{
    /// <summary>Packs given value with related warnings.</summary>
    public static WithWarnings<TValue> WithWarnings<TValue>(this TValue value, params TrimmedRequiredString[] warnings)
        => value.WithWarnings((IEnumerable<TrimmedRequiredString>)warnings);

    /// <summary>Packs given value with related warnings.</summary>
    public static WithWarnings<TValue> WithWarnings<TValue>(this TValue value, IEnumerable<TrimmedRequiredString> warnings)
        => new WithWarnings<TValue>(value, warnings);
}
