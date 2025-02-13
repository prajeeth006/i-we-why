using System;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates the value to be greater than or equal to predefined minimum.
/// </summary>
internal class MinimumAttribute : ValidationAttributeBase
{
    private readonly IComparable minimum;
    private readonly Func<object, IComparable> castValue;

    public MinimumAttribute(double minimum)
        : this(minimum, o => Convert.ToDouble(o)) { }

    protected MinimumAttribute(IComparable minimum, Func<object, IComparable> castValue)
    {
        this.minimum = minimum;
        this.castValue = castValue;
    }

    public override string? GetInvalidReason(object value)
        => castValue(value).CompareTo(minimum) < 0
            ? $"must be greater than or equal to {minimum}"
            : null;
}

/// <summary>
/// Implementation of <see cref="MinimumAttribute" /> for validation of timespan specified as string constant for the attribute decorating a property.
/// </summary>
internal sealed class MinimumTimeSpanAttribute(string minimum) : MinimumAttribute(TimeSpan.Parse(minimum), o => (TimeSpan)o) { }
