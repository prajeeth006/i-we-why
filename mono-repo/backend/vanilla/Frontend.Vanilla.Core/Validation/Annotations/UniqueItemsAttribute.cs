using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Validates collection member to contain only unique values thus no duplicates.
/// </summary>
internal class UniqueItemsAttribute : CollectionValidationAttribute
{
    private readonly StringComparison? comparison;

    public UniqueItemsAttribute(StringComparison comparison)
        => this.comparison = comparison;

    public UniqueItemsAttribute() { }

    public override string? GetInvalidReason<T>(IEnumerable<T> collection)
    {
        if (comparison != null && typeof(T) != typeof(string))
            throw new Exception($"It doesn't make sense to put {this} with StringComparison.{comparison} on value {collection.GetType()}"
                                + $" because its item is {typeof(T)} instead of expected {typeof(string)}.");

        var comparer = (IEqualityComparer<T>?)comparison?.ToComparer() ?? EqualityComparer<T>.Default;
        var requirement = comparison != null ? $"unique strings according to {comparison} comparison" : "unique items";

        var duplicates = collection.FindDuplicatesBy(i => i, comparer).ToList();

        return duplicates.Count > 0
            ? $"must contain {requirement} but there are duplicates: {duplicates.Select(FormatActualValue).ToDebugString()}"
            : null;
    }
}
