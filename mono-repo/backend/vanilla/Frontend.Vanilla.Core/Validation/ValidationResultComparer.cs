using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.Validation;

/// <summary>
/// Determines equality of two instances by their <see cref="ValidationResult.ErrorMessage" /> and <see cref="ValidationResult.MemberNames" />
/// beceause by <see cref="ValidationResult" /> doesn't implement respective methods.
/// </summary>
internal sealed class ValidationResultComparer : ReferenceTypeEqualityComparer<ValidationResult>
{
    public override bool EqualsCore(ValidationResult x, ValidationResult y)
        => x.ErrorMessage == y.ErrorMessage
           && x.MemberNames.ToHashSet().SetEquals(y.MemberNames);

    public override int GetHashCode(ValidationResult obj)
        => obj.ErrorMessage?.GetHashCode() ?? 0;
}
