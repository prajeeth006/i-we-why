using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;
using Xunit.Internal;
using Xunit.Sdk;
using Xunit.v3;

namespace Frontend.Vanilla.Testing.Xunit;

internal class ValuesDataAttribute(params object[] values) : DataAttribute
{
    public IReadOnlyCollection<object> Values { get; } = values;

    public ValuesDataAttribute(IEnumerable values)
        : this([.. values.Cast<object>()]) { }

    public override ValueTask<IReadOnlyCollection<ITheoryDataRow>> GetData(MethodInfo testMethod, DisposalTracker disposalTracker)
    {
        var a = Values.Select(v => new TheoryDataRow(v)).CastOrToReadOnlyCollection();
        return ValueTask.FromResult<IReadOnlyCollection<ITheoryDataRow>>(a);
    }

    public override bool SupportsDiscoveryEnumeration() => true;
}
