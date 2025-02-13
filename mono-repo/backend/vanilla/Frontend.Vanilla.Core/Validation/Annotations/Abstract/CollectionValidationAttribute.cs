using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Validation.Annotations.Abstract;

/// <summary>
/// Base class for validation of collections.
/// </summary>
internal abstract class CollectionValidationAttribute : GenericValidationAttribute
{
    protected sealed override Type GenericType { get; } = typeof(IEnumerable<>);

    public abstract string? GetInvalidReason<T>(IEnumerable<T> collection);

    public string FormatActualValue<T>(IEnumerable<T> items)
        => "[" + items.Select(i => i.Dump()).Join() + "]";
}
