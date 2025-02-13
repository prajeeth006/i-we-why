using System;
using System.Linq;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Validation.Annotations.Abstract;

/// <summary>
/// Base class for strongly-typed validation of generic objects.
/// </summary>
internal abstract class GenericValidationAttribute : ValidationAttributeBase
{
    protected abstract Type GenericType { get; }

    protected GenericValidationAttribute()
        // Put a line break before actual value b/c invalid reason for collections is very long
        => ErrorMessage = $"{Placeholders.MemberName} {Placeholders.InvalidReason}{Environment.NewLine}Actual value: {Placeholders.ActualValue}";

    public sealed override string? GetInvalidReason(object value)
        => InvokeGeneric("GetInvalidReason", value);

    public sealed override string FormatActualValue(object value)
        => InvokeGeneric("FormatActualValue", value);

    private string InvokeGeneric(string methodName, object value)
    {
        Guard.Assert(GenericType.IsInterface && GenericType.IsGenericTypeDefinition, "Only generic interfaces are supported.");
        var genericTypes = value.GetType()
            .GetInterfaces()
            .Where(i => i.IsGenericType && i.GetGenericTypeDefinition() == GenericType)
            .Select(i => i.GetGenericArguments())
            .ToList();

        if (genericTypes.Count != 1)
            throw new Exception(
                $"Object must implement {GenericType} once to be validatable by {this}"
                + $" but current value is {value.GetType()} which implements it {genericTypes.Count} times.");

        return (string)this.InvokeGeneric(methodName, genericTypes[0], value);
    }
}
