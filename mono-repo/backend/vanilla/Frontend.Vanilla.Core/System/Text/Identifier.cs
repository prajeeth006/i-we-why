using System;
using System.Linq;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// A string which complies to requirements for an identifier in a programming language e.g. C# or JavaScript.
/// </summary>
public sealed class Identifier : TrimmedRequiredString
{
    private new static string? GetInvalidReason(string value)
    {
        if (TrimmedRequiredString.GetInvalidReason(value) is string baseReason)
            return baseReason;

        if (!char.IsLetter(value[0]))
            return "doesn't start with a letter";

        var invalidChars = value.Where(c => !IsValidChar(c)).ToList();

        return invalidChars.Count > 0
            ? $"contains unsupported characters: {invalidChars.Dump()}"
            : null;
    }

    internal static bool IsValidChar(char c)
        => c is '_' or >= 'a' and <= 'z' or >= 'A' and <= 'Z' or >= '0' and <= '9';

    /// <summary>Creates a new instance.</summary>
    /// <exception cref="ArgumentException">If given string isn't valid according to restrictions of this class.</exception>
    public Identifier(string value)
        : base(value,
            GetInvalidReason,
            mustBe: "an identifier which starts with a letter and contains only ASCII letters, digits or underscores so that it can be used e.g. C# or JavaScript") { }
}
