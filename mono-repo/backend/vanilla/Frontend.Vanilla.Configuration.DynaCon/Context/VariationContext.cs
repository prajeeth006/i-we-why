using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Represents application context in which the configuration instance should be used.
/// </summary>
internal sealed class VariationContext : ToStringEquatable<VariationContext>
{
    public ulong Priority { get; }

    /// <summary>
    /// Includes all children e.g. qa -> [qa, qa1, qa2, qa3, dev]
    /// ReadOnlySet is used b/c it has Contains() method directly.
    /// </summary>
    public IReadOnlyDictionary<TrimmedRequiredString, ReadOnlySet<TrimmedRequiredString>> Properties { get; }

    public VariationContext(ulong priority, IEnumerable<(TrimmedRequiredString Name, TrimmedRequiredString Value)> properties)
    {
        var comparer = RequiredStringComparer.OrdinalIgnoreCase;
        Priority = priority;
        Properties = properties
            .GroupBy(p => p.Name, comparer.AsTrimmed())
            .OrderBy(g => g.Key, comparer)
            .ToDictionary(
                g => g.Key,
                g => g.Select(p => p.Value)
                    .OrderBy(v => v)
                    .ToHashSet(comparer.AsTrimmed())
                    .AsReadOnly(),
                comparer.AsTrimmed())
            .AsReadOnly();
    }

    public override string ToString()
    {
        var propsDesc = Properties.Count > 0 ? Properties.Select(p => $"{p.Key}=[{p.Value.Join()}]").Join() : "any";

        return $"({propsDesc}, priority={Priority})";
    }
}
