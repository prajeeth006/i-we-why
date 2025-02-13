using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates that the value of an enum property is within defined values of particular enum type.
/// </summary>
internal sealed class DefinedEnumValueAttribute : ValidationAttributeBase
{
    public override string? GetInvalidReason(object value)
    {
        var type = value.GetType();

        return !Enum.IsDefined(type, value)
            ? $"is not one of allowed values: {Enum.GetNames(type).Join()} for enum type {type}"
            : null;
    }
}
