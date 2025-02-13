using System.Collections.Generic;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Moq;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;

internal static class TestCtxHierarchy
{
    public static VariationContextHierarchy Get(ConfigurationSource source = ConfigurationSource.Service)
    {
        var hierarchy = new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            ["Label"] = new Dictionary<string, string>
            {
                { "bwin.com", null },
            },
            ["environment"] = new Dictionary<string, string>
            {
                { "qa2", "qa" },
                { "qa", null },
                { "prod", null },
            },
        };

        return new VariationContextHierarchy(hierarchy, source);
    }

    public static ICurrentContextHierarchy AsCurrent(this VariationContextHierarchy hierarchy)
        => Mock.Of<ICurrentContextHierarchy>(h => h.Value == hierarchy);
}
