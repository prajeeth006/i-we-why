using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Validation.Annotations.Abstract;

/// <summary>
/// Base class for validation of dictionaries.
/// </summary>
internal abstract class DictionaryValidationAttribute : GenericValidationAttribute
{
    protected sealed override Type GenericType { get; } = typeof(IDictionary<,>);

    public abstract string? GetInvalidReason<TKey, TValue>(IDictionary<TKey, TValue> dictionary);

    protected string FormatActualValue<TKey, TValue>(IEnumerable<KeyValuePair<TKey, TValue>> items)
    {
        var nl = Environment.NewLine;

        return "{" + nl + items.Select(i => $"    {i.Key.Dump()}: {i.Value.Dump()}").Join("," + nl) + nl + "}";
    }
}
