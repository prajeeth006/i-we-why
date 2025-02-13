using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.E_Context;

public class ContextOptimizationDecoratorTests
{
    private IContextEnumerator target;
    private IReadOnlyList<VariationContext> innerResult;
    private VariationHierarchyResponse ctxHierarchy;
    private IReadOnlyDictionary<string, KeyConfiguration> featureDto;

    public ContextOptimizationDecoratorTests()
    {
        var inner = new Mock<IContextEnumerator>();
        var staticVarCtx = new StaticVariationContext(("environment", "whatever"));
        target = new ContextOptimizationDecorator(inner.Object, staticVarCtx);

        featureDto = new Dictionary<string, KeyConfiguration>();
        ctxHierarchy = new VariationHierarchyResponse(
            new Dictionary<string, IReadOnlyDictionary<string, string>>
            {
                ["product"] = new Dictionary<string, string>
                {
                    { "sports", null },
                    { "casino", null },
                    { "live", "sports" },
                },
                ["channel"] = new Dictionary<string, string>
                {
                    { "mobile", null },
                    { "desktop", null },
                },
                ["label"] = new Dictionary<string, string>
                {
                    { "bwin.es", null },
                    { "party.com", null },
                },
                ["environment"] = new Dictionary<string, string>
                {
                    { "qa", null },
                    { "beta", null },
                },
            });
        inner.Setup(i => i.GetContexts(featureDto, ctxHierarchy)).Returns(() => innerResult);
    }

    [Fact]
    public void ShouldExcludeUnnecessaryContextsCoveredByOnesWithHigherPriority()
    {
        innerResult = new[]
        {
            TestVarCtx.Get(), // 0
            TestVarCtx.Get(label: "bwin.es"), // 1
            TestVarCtx.Get(product: new[] { "sports", "live" }, priority: 10), // 2
            TestVarCtx.Get(product: "casino", channel: "mobile"), // 3
            TestVarCtx.Get(product: "casino", channel: "desktop"), // 4
            TestVarCtx.Get(channel: "desktop"), // 5
            TestVarCtx.Get(product: "casino"), // 6
            TestVarCtx.Get(product: "live", priority: 11), // 7
        };

        var result = target.GetContexts(featureDto, ctxHierarchy); // Act
        var expected = new List<VariationContext> { innerResult[2], innerResult[3], innerResult[4], innerResult[7] };
        result.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void ShouldReturnSameContexts_IfNothingDynamicToOptimize()
        => RunAndExpectSame(
            TestVarCtx.Get(environment: "qa"),
            TestVarCtx.Get(),
            TestVarCtx.Get(environment: "beta"));

    [Fact]
    public void ShouldReturnSameContexts_IfAlreadyOptimal()
        => RunAndExpectSame(
            TestVarCtx.Get(environment: "qa"),
            TestVarCtx.Get(),
            TestVarCtx.Get(product: "sports"),
            TestVarCtx.Get(product: "casino", channel: "mobile"));

    private void RunAndExpectSame(params VariationContext[] contexts)
    {
        innerResult = contexts;

        var result = target.GetContexts(featureDto, ctxHierarchy); // Act

        result.Should().BeEquivalentTo(innerResult);
    }
}
