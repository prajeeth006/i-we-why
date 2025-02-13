using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates dictionary string keys to be unique according to given comparison.
/// </summary>
internal sealed class UniqueKeysAttribute(StringComparison comparison) : DictionaryValidationAttribute
{
    public override string? GetInvalidReason<TKey, TValue>(IDictionary<TKey, TValue> dictionary)
    {
        if (typeof(TKey) != typeof(string))
            throw new Exception($"{this} can be used only with {typeof(string)} keys but value {dictionary.GetType()} has {typeof(TKey)} keys.");

        var comparer = (IEqualityComparer<TKey>)comparison.ToComparer();
        var duplicates = dictionary.FindDuplicatesBy(i => i.Key, comparer).ToList();

        return duplicates.Count > 0
            ? $"must contain items with unique keys according to {comparison} comparison but these collide: {duplicates.Select(FormatActualValue).ToDebugString()}"
            : null;
    }
}
