using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.Patterns;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Wrapper for a string which can't be null, empty nor white-space.
/// Used to express contract of an interfaced service explicitly, remove input validations and enforce exceptions early in consumers' unit tests if they pass invalid value.
/// This will be especially useful with C# 8 which supports non-nullable references -> valid input guaranteed almost always.
/// </summary>
[JsonConverter(typeof(RequiredStringJsonConverter))]
public class RequiredString : ToStringEquatable<RequiredString>, IEquatable<string>
{
    /// <summary>Gets the string value.</summary>
    public string Value { get; }

    /// <summary>Creates a new instance.</summary>
    /// <exception cref="ArgumentException">If given string isn't valid according to restrictions of this class.</exception>
    public RequiredString(string value)
        : this(value, GetInvalidReason, mustBe: "a required string") { }

    /// <summary>Used by inherited classes to execute the validation only once and with comprehensive error message.</summary>
    private protected RequiredString(string value, Func<string, string?> getInvalidReason, string mustBe)
    {
        var invalidReason = getInvalidReason(value);
        Value = invalidReason == null
            ? value
            : throw new ArgumentException($"The value must be {mustBe} but it {invalidReason}.");
    }

    private protected static string? GetInvalidReason(string value)
    {
        if (value == null) return "is null";
        if (value.Length == 0) return "is empty";

        return value.All(char.IsWhiteSpace) ? "contains only white-spaces" : null;
    }

    internal static RequiredString? TryCreate(string? value)
        => value != null && GetInvalidReason(value) == null ? new RequiredString(value, _ => null, "already ok") : null;

    /// <summary>Creates a new instance from given string.</summary>
    public static implicit operator RequiredString(string value)
        => new (value);

    /// <summary>Converts this instance to regular string.</summary>
    [return: NotNullIfNotNull("str")] // TODO change to "string?" once bug is fixed https://github.com/dotnet/roslyn/issues/39802 (FIXED)
    public static implicit operator string(RequiredString str)
#pragma warning disable CS8603 // Possible null reference return.
        => str?.Value;
#pragma warning restore CS8603 // Possible null reference return.

    /// <summary>Converts this instance to <see cref="StringValues" />.</summary>
    public static implicit operator StringValues(RequiredString? str)
        => str?.Value;

    /// <summary>Converts this instance to regular string.</summary>
    public override string ToString()
        => Value;

    /// <summary>Determines whether <see langword="this" /> string is equal to the given string.</summary>
    public bool Equals(string? other)
        => Value.Equals(other);

    /// <summary>Determines whether <see langword="this" /> string is equal to the given string using <see cref="StringComparison.OrdinalIgnoreCase" />.</summary>
    public bool EqualsIgnoreCase(string? other)
        => Value.Equals(other, StringComparison.OrdinalIgnoreCase);

    /// <summary>Determines whether <see langword="this" /> string is equal to the given object.</summary>
    public override bool Equals(object? obj)
        => obj switch
        {
            string str => Equals(str),
            RequiredString rs => Equals(rs.Value),
            _ => false,
        };

    /// <summary>See <see cref="object.GetHashCode()" />.</summary>
    public override int GetHashCode()
        => Value.GetHashCode();

    private sealed class RequiredStringJsonConverter : JsonConverterBase<RequiredString>
    {
        public override RequiredString Read(JsonReader reader, Type objectType, JsonSerializer serializer)
            => (RequiredString)Activator.CreateInstance(objectType, reader.GetRequiredValue<string>())!; // Works for inherited classes too

        public override void Write(JsonWriter writer, RequiredString value, JsonSerializer serializer)
            => writer.WriteValue(value.ToString());
    }
}
