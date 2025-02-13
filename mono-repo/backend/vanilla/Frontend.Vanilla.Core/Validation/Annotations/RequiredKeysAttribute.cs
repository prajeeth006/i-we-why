using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates dictionary string keys to be not white-space.
/// </summary>
internal sealed class RequiredKeysAttribute : DictionaryValidationAttribute
{
    public override string? GetInvalidReason<TKey, TValue>(IDictionary<TKey, TValue> dictionary)
    {
        if (typeof(TKey) != typeof(string) && typeof(TKey) != typeof(object))
            throw new Exception(
                $"It doesn't make sense to put {this} on value {dictionary.GetType()} because its keys are not {typeof(string)} nor {typeof(object)}"
                + $" (they are {typeof(TKey)}) and null isn't allowed for a dictionary in general.");

        var invalidItems = dictionary.Where(i => !RequiredHelper.IsValid(i.Key)).ToList();

        return invalidItems.Count > 0
            ? "can't contain empty nor white-space keys but there are items with such keys: " + FormatActualValue(invalidItems)
            : null;
    }
}
