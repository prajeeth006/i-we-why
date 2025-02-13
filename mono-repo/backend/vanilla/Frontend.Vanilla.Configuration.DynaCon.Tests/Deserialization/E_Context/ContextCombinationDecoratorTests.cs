using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.E_Context;

public sealed class ContextCombinationDecoratorTests
{
    [Fact]
    public void ShouldCombineAllContexts()
        => RunTest(
            innerContexts: new[]
            {
                TestVarCtx.Get(product: new[] { "portal" }),
                TestVarCtx.Get(channel: new[] { "mobile" }),
                TestVarCtx.Get(label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
            },
            expectedContexts: new[]
            {
                TestVarCtx.Get(product: new[] { "portal" }),
                TestVarCtx.Get(channel: new[] { "mobile" }),
                TestVarCtx.Get(label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "mobile" }),
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "mobile" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(channel: new[] { "mobile" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
            });

    [Fact]
    public void ShouldNotCombine_IfDifferentValuesOrEqualItems()
        => RunTest(
            innerContexts: new[]
            {
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.es", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal", "native" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
            },
            expectedContexts: new[]
            {
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.es", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal", "native" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
            });

    [Fact]
    public void ShouldCombineAcrossValuesAndCalculateCorrectPriority()
        => RunTest(
            innerContexts: new[]
            {
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(channel: new[] { "mobile" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
            },
            expectedContexts: new[]
            {
                TestVarCtx.Get(product: new[] { "portal" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(channel: new[] { "mobile" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(product: new[] { "portal" }, channel: new[] { "mobile" }, label: new[] { "bwin.com", "bwin" }),
                TestVarCtx.Get(),
            });

    [Fact]
    public void ShouldReturnOnlyAnyContext_IfNothingCustom()
        => RunTest(
            innerContexts: new[] { TestVarCtx.Get(), TestVarCtx.Get(), TestVarCtx.Get() },
            expectedContexts: new[] { TestVarCtx.Get() });

    [Fact]
    public void ShouldKeepAnyContext_IfHasPriority()
        => RunTest(
            innerContexts: new[]
            {
                TestVarCtx.Get(),
                TestVarCtx.Get(priority: 128),
                TestVarCtx.Get(priority: 256),
                TestVarCtx.Get(priority: 64, product: "sports"),
            },
            expectedContexts: new[]
            {
                TestVarCtx.Get(),
                TestVarCtx.Get(priority: 128),
                TestVarCtx.Get(priority: 256),
                TestVarCtx.Get(priority: 384),
                TestVarCtx.Get(priority: 64, product: "sports"),
                TestVarCtx.Get(priority: 192, product: "sports"),
                TestVarCtx.Get(priority: 320, product: "sports"),
                TestVarCtx.Get(priority: 448, product: "sports"),
            });

    private static void RunTest(VariationContext[] innerContexts, VariationContext[] expectedContexts)
    {
        var inner = new Mock<IContextEnumerator>();
        var featureDto = Mock.Of<IReadOnlyDictionary<string, KeyConfiguration>>();
        var varHierarchy = TestCtxHierarchy.Get();
        IContextEnumerator target = new ContextCombinationDecorator(inner.Object);

        inner.Setup(i => i.GetContexts(featureDto, varHierarchy)).Returns(innerContexts);

        // Act
        var contexts = target.GetContexts(featureDto, varHierarchy);

        contexts.Should().BeEquivalentTo(expectedContexts);
    }
}
