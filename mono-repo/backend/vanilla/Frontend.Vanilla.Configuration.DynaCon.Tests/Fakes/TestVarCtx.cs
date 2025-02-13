using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;

internal static class TestVarCtx
{
    public static VariationContext Get(
        StringValues product = default,
        StringValues channel = default,
        StringValues label = default,
        StringValues environment = default,
        ulong? priority = null)
    {
        var props = new List<(TrimmedRequiredString name, TrimmedRequiredString value)>();

        AddProperty(nameof(product), product);
        AddProperty(nameof(channel), channel);
        AddProperty(nameof(label), label);
        AddProperty(nameof(environment), environment);

        var finalPriority = priority ?? TestPriority.Calculate(product.Any(), channel.Any(), label.Any(), environment.Any());

        return new VariationContext(finalPriority, props);

        void AddProperty(string name, StringValues values)
        {
            foreach (var value in values)
                props.Add((name, value));
        }
    }
}
