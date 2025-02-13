using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// In addition to <see cref="RequiredAttribute" /> specifies custom validation message
/// and provides static method for validation.
/// </summary>
internal sealed class RequiredStringAttribute : RequiredAttribute
{
    private static readonly RequiredStringAttribute Singleton = new RequiredStringAttribute();

    public RequiredStringAttribute()
        => ErrorMessage = "{0} can't be null nor white-space.";

    public static ValidationResult? Validate(object value, string propertyName, string? displayName = null)
    {
        Guard.NotWhiteSpace(propertyName, nameof(propertyName));
        Guard.Requires(displayName == null || !string.IsNullOrWhiteSpace(displayName), nameof(displayName), "Must be either null or not empty.");

        return !Singleton.IsValid(value)
            ? new ValidationResult(string.Format(Singleton.ErrorMessage!, displayName ?? propertyName), new[] { propertyName })
            : null; // Same as ValidationResult.Success;
    }
}
