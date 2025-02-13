using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;

internal static class TestValueConfig
{
    public static ValueConfiguration Get(
        object value,
        string product = null,
        string channel = null,
        string label = null,
        string environment = null,
        ulong? priority = null)
    {
        var context = new Dictionary<string, string>();
        if (product != null) context.Add(nameof(product), product);
        if (channel != null) context.Add(nameof(channel), channel);
        if (label != null) context.Add(nameof(label), label);
        if (environment != null) context.Add(nameof(environment), environment);

        var finalPriority = priority ?? TestPriority.Calculate(product != null, channel != null, label != null, environment != null);

        return new ValueConfiguration(value, context, finalPriority);
    }

    public static ValueConfiguration GetJson(
        string value,
        string product = null,
        string channel = null,
        string label = null,
        string environment = null,
        ulong? priority = null)
        => Get(JToken.Parse(value), product, channel, label, environment, priority);
}
