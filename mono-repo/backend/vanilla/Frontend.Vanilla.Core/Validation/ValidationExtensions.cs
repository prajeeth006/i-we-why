using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Core.Validation;

internal static class ValidationExtensions
{
    public static void Add(this ICollection<ValidationResult> errors, string errorMessage, string memberName)
        => errors.Add(new ValidationResult(errorMessage, new[] { memberName }));
}
