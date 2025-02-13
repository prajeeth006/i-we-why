using System;
using System.Diagnostics.CodeAnalysis;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Requires that string is trimmed in addition to <see cref="RequiredString" />.
/// Used to express contract of an interfaced service explicitly, remove input validations and enforce exceptions early in consumers' unit tests if they pass invalid value.
/// </summary>
public class TrimmedRequiredString : RequiredString
{
    private protected new static string? GetInvalidReason(string value)
        => RequiredString.GetInvalidReason(value)
           ?? (char.IsWhiteSpace(value[0]) ? "starts with a white-space" : null)
           ?? (char.IsWhiteSpace(value.LastChar()) ? "ends with a white-space" : null);

    /// <summary>Creates a new instance.</summary>
    /// <exception cref="ArgumentException">If given string isn't valid according to restrictions of this class.</exception>
    public TrimmedRequiredString(string value)
        : base(value, GetInvalidReason, mustBe: "a trimmed required string") { }

    /// <summary>Used by inherited classes to execute the validation only once and with comprehensive error message.</summary>
    private protected TrimmedRequiredString(string value, Func<string, string?> getInvalidReason, string mustBe)
        : base(value, getInvalidReason, mustBe) { }

    /// <summary>Creates a new instance from given string.</summary>
    public static implicit operator TrimmedRequiredString(string value)
        => new (value);

    internal static bool IsValid([NotNullWhen(true)] string? value)
        => value != null && GetInvalidReason(value) == null;

    internal new static TrimmedRequiredString? TryCreate(string? value)
        => value != null && GetInvalidReason(value) == null ? new TrimmedRequiredString(value, _ => null, "already ok") : null;
}
