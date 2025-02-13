using System.ComponentModel.DataAnnotations;
using System.Text;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Validation.Annotations.Abstract;

/// <summary>
/// Base class to reduce code duplication. It constructs error messages based on provided format.
/// Value is not validated if it's null or white-space string because that's the task of <see cref="RequiredAttribute" />.
/// </summary>
internal abstract class ValidationAttributeBase : ValidationAttribute
{
    public static class Placeholders
    {
        public const string MemberName = "{MemberName}";
        public const string ActualValue = "{ActualValue}";
        public const string InvalidReason = "{InvalidReason}";
    }

    protected ValidationAttributeBase()
        => ErrorMessage = $"{Placeholders.MemberName} {Placeholders.InvalidReason}. Actual value: {Placeholders.ActualValue}.";

    protected sealed override ValidationResult IsValid(object? value, ValidationContext context)
    {
        if (RequiredHelper.IsValidatedByRequiredAttribute(value))
            return ValidationResult.Success!;

        var reason = GetInvalidReason(value);

        if (reason.IsNullOrWhiteSpace())
            return ValidationResult.Success!;

        var formattedValue = FormatActualValue(value);
        var builder = new StringBuilder(ErrorMessage);

        builder.Replace(Placeholders.MemberName, context.MemberName);
        builder.Replace(Placeholders.ActualValue, formattedValue);
        builder.Replace(Placeholders.InvalidReason, reason);

        return new ValidationResult(builder.ToString(), new[] { context.MemberName! });
    }

    public abstract string? GetInvalidReason(object value);

    public virtual string FormatActualValue(object value)
        => value.Dump();
}
