using System.Collections;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates that property of any type implementing <see cref="IEnumerable" /> is not an empty collection.
/// It still can be <c>null</c> to pass the validation. Can be used in combination with <see cref="RequiredAttribute" />.
/// </summary>
internal sealed class NotEmptyCollectionAttribute : ValidationAttributeBase
{
    public const string InvalidReason = "collection can't be empty";

    public NotEmptyCollectionAttribute()
        => ErrorMessage = $"{Placeholders.MemberName} {Placeholders.InvalidReason}.";

    public override string? GetInvalidReason(object value)
        => ((IEnumerable)value).GetEnumerator().MoveNext() == false
            ? InvalidReason
            : null;
}
