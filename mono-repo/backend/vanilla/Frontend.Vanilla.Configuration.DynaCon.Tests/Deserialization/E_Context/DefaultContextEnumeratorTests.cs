using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.System.Text;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.E_Context;

public sealed class DefaultContextEnumeratorTests
{
    [Fact]
    public void ShouldEnumerateAllUniqueContextsFromDto()
    {
        var featureDto = new Dictionary<string, KeyConfiguration>
        {
            ["Foo"] = new KeyConfiguration(
                "string",
                new[]
                {
                    TestValueConfig.Get("v1", product: "portal"),
                    TestValueConfig.Get("v2", channel: "mobile"),
                    TestValueConfig.Get("V3", product: "sports", label: "bwin.com"),
                    TestValueConfig.Get("v4"),
                }),
            ["Bar"] = new KeyConfiguration(
                "string",
                new[]
                {
                    TestValueConfig.Get("v5", channel: "mobile"),
                    TestValueConfig.Get("V6", product: "sports"),
                    TestValueConfig.Get("v7", label: "cheekysluts.com"),
                    TestValueConfig.Get("v8"),
                }),
        };
        var hierarchyExpander = new Mock<IContextHierarchyExpander>();
        var hierarchy = TestCtxHierarchy.Get();
        IContextEnumerator target = new DefaultContextEnumerator(hierarchyExpander.Object);

        hierarchyExpander.Setup(e => e.GetChildren(hierarchy, It.IsNotNull<TrimmedRequiredString>(), It.IsNotNull<TrimmedRequiredString>()))
            .Returns<VariationHierarchyResponse, RequiredString, RequiredString>((h, p, v) => new TrimmedRequiredString[] { $"{p} {v} c1", "c2" });

        // Act
        var contexts = target.GetContexts(featureDto, hierarchy);

        contexts.Should().BeEquivalentTo(new[]
        {
            TestVarCtx.Get(product: new[] { "portal", "product portal c1", "c2" }),
            TestVarCtx.Get(channel: new[] { "mobile", "channel mobile c1", "c2" }),
            TestVarCtx.Get(product: new[] { "sports", "product sports c1", "c2" }, label: new[] { "bwin.com", "label bwin.com c1", "c2" }),
            TestVarCtx.Get(product: new[] { "sports", "product sports c1", "c2" }),
            TestVarCtx.Get(label: new[] { "cheekysluts.com", "label cheekysluts.com c1", "c2" }),
            TestVarCtx.Get(),
        });
    }
}
