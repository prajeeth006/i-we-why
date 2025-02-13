using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;
using Xunit.Internal;
using Xunit.Sdk;
using Xunit.v3;

namespace Frontend.Vanilla.Testing.Xunit;

/// <summary>
/// Enables repeating of tests.
/// </summary>
public sealed class RepeatAttribute : DataAttribute
{
    private readonly int count;

    /// <summary>
    /// Receives count of repetitions.
    /// </summary>
    public RepeatAttribute(int count)
    {
        if (count < 1)
        {
            throw new ArgumentOutOfRangeException(
                paramName: nameof(count),
                message: "Repeat count must be greater than 0.");
        }

        this.count = count;
    }

    /// <summary>
    /// GetData.
    /// </summary>
    public override ValueTask<IReadOnlyCollection<ITheoryDataRow>> GetData(MethodInfo testMethod, DisposalTracker disposalTracker)
    {
        var data = Enumerable.Range(start: 1, count: count).Select(x => new TheoryDataRow(new[] { x })).CastOrToReadOnlyCollection();
        return ValueTask.FromResult<IReadOnlyCollection<ITheoryDataRow>>(data);
    }

    /// <summary>SupportsDiscoveryEnumeration.</summary>
    public override bool SupportsDiscoveryEnumeration() => true;
}
