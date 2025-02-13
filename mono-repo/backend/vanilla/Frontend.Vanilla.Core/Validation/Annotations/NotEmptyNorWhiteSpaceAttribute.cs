using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Verifies that value is not empty nor white-space string. However it can still be null.
/// This is usefull to avoid unnecessary trimming.
/// It doesn't make sense to use it together with RequiredAttribute which already checks null or white-space.
/// </summary>
internal sealed class NotEmptyNorWhiteSpaceAttribute : ValidationAttribute
{
    public NotEmptyNorWhiteSpaceAttribute()
        => ErrorMessage = "{0} can't be empty nor white-space. However it can be null.";

    public override bool IsValid(object? value)
        => value == null || !string.IsNullOrWhiteSpace((string)value);
}
