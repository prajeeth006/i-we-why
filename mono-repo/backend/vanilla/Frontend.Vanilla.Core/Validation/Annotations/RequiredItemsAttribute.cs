using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates collection item to be not null or not white-space in case of strings.
/// </summary>
internal sealed class RequiredItemsAttribute : CollectionValidationAttribute
{
    public override string? GetInvalidReason<T>(IEnumerable<T> collection)
    {
        if (!typeof(T).CanBeNull())
            throw new Exception($"It doesn't make sense to put {this} on {collection.GetType()} because its values are of type {typeof(T)} which can't be null.");

        var invalidItems = collection.Where(i => !RequiredHelper.IsValid(i)).ToList();

        return invalidItems.Count > 0
            ? $"can't contain {RequiredHelper.GetUnallowedDescription<T>()} but there are items with such values: {FormatActualValue(invalidItems)}"
            : null;
    }
}
