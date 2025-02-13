using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates dictionary values to be not null or not white-space in case of strings.
/// </summary>
internal sealed class RequiredValuesAttribute : DictionaryValidationAttribute
{
    public override string? GetInvalidReason<TKey, TValue>(IDictionary<TKey, TValue> dictionary)
    {
        if (!typeof(TValue).CanBeNull())
            throw new Exception($"It doesn't make sense to put {this} on {dictionary.GetType()} because its values are of type {typeof(TValue)} which can't be null.");

        var invalidItems = dictionary.Where(i => !RequiredHelper.IsValid(i.Value)).ToList();

        return invalidItems.Count > 0
            ? $"can't contain {RequiredHelper.GetUnallowedDescription<TValue>()} but there are items with such values: {FormatActualValue(invalidItems)}"
            : null;
    }
}
