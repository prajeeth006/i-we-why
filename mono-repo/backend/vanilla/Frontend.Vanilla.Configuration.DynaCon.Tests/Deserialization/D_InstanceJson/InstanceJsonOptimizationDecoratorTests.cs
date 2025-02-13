using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.D_InstanceJson;

public sealed class InstanceJsonOptimizationDecoratorTests
{
    [Fact]
    public void ShouldRemoveUselessEntries()
    {
        var configs = new Dictionary<int, (JObject InstanceJson, VariationContext)>
        {
            [0] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" })),
            [1] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "mobile" })), // Covered by 0
            [2] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "desktop" })), // Covered by 0
            [3] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" })), // Covered by 0
            [4] = (JObject.Parse("{ Foo: 2 }"), TestVarCtx.Get(priority: 10, product: new[] { "sports" }, label: new[] { "bwin.es", "bwin" })),
            [5] = (JObject.Parse("{ Foo: 2 }"),
                TestVarCtx.Get(priority: 11, product: new[] { "sports" }, label: new[] { "bwin.es" })), // Covered by 4, explicit priority is needed
            [6] = (JObject.Parse("{ Foo: 0 }"), TestVarCtx.Get()),
        };
        RunTest(configs.Values, expectedResult: new[] { configs[0], configs[4], configs[6] });
    }

    [Fact]
    public void ShouldRemoveUselessCombinations()
    {
        var configs = new Dictionary<int, (JObject InstanceJson, VariationContext)>
        {
            [0] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" })),
            [1] = (JObject.Parse("{ Foo: 2 }"), TestVarCtx.Get(channel: new[] { "mobile" })),
            [2] = (JObject.Parse("{ Foo: 3 }"), TestVarCtx.Get(label: new[] { "bwin.com" })),
            [3] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "mobile" })),
            [4] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com" })),
            [5] = (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "mobile" }, label: new[] { "bwin.com" })),
            [6] = (JObject.Parse("{ Foo: 2 }"), TestVarCtx.Get(channel: new[] { "mobile" }, label: new[] { "bwin.com" })),
            [7] = (JObject.Parse("{ Foo: 0 }"), TestVarCtx.Get()),
        };
        RunTest(configs.Values, expectedResult: new[] { configs[0], configs[1], configs[2], configs[7] });
    }

    [Fact]
    public void ShouldKeepEntries_IfNeededBecauseOfPriorities()
    {
        var configs = new (JObject InstanceJson, VariationContext)[]
        {
            (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(priority: 2, label: new[] { "bwin.com" }, product: new[] { "portal" })), // Needed because of value 2
            (JObject.Parse("{ Foo: 2 }"), TestVarCtx.Get(priority: 1, product: new[] { "portal" })),
            (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(priority: 2, label: new[] { "bwin.com", "bwin" }, channel: new[] { "mobile" })), // Needed because of value 3
            (JObject.Parse("{ Foo: 3 }"), TestVarCtx.Get(priority: 1, label: new[] { "bwin.com" }, channel: new[] { "mobile" })),
            (JObject.Parse("{ Foo: 1 }"), TestVarCtx.Get(priority: 0, label: new[] { "bwin.com" })),
        };
        RunTest(configs, expectedResult: configs);
    }

    private static void RunTest(IEnumerable<(JObject InstanceJson, VariationContext Context)> innerResult,
        IEnumerable<(JObject InstanceJson, VariationContext Context)> expectedResult)
    {
        var inner = new Mock<IInstanceJsonResolver>();
        IInstanceJsonResolver target = new InstanceJsonOptimizationDecorator(inner.Object);
        var featureDto = Mock.Of<IReadOnlyDictionary<string, KeyConfiguration>>();
        var varHierarchy = TestCtxHierarchy.Get();
        inner.Setup(i => i.Resolve(featureDto, varHierarchy)).Returns(innerResult);

        // Act
        var result = target.Resolve(featureDto, varHierarchy);

        result.Should().Equal(expectedResult);
    }
}
