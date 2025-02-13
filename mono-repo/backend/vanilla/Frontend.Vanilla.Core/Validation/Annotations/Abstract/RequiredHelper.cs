using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.Validation.Annotations.Abstract;

/// <summary>
/// Helper related to <see cref="RequiredAttribute" />.
/// </summary>
internal static class RequiredHelper
{
    private static readonly RequiredAttribute Attribute = new RequiredAttribute();

    public static bool IsValid([NotNullWhen(true)] object? value)
        => Attribute.IsValid(value);

    public static string GetUnallowedDescription<T>()
        => typeof(T).EqualsAny(typeof(string), typeof(object)) ? "null values nor white-space strings" : "null values";

    public static bool IsValidatedByRequiredAttribute([NotNullWhen(false)] object? value)
        => value == null || (value is string && string.IsNullOrWhiteSpace((string)value));
}
