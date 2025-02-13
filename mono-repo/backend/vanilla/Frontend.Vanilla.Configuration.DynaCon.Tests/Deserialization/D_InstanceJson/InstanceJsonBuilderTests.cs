using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.D_InstanceJson;

public sealed class InstanceJsonBuilderTests
{
    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        // Defaults
        new object[]
        {
            TestVarCtx.Get(), @"{
                CtxHierarchy: 'default',
                NestedJson: 'default',
                RawValue: 'default',
            }",
        },

        // Should overwrite raw value
        new object[]
        {
            TestVarCtx.Get(label: "bwin.es"),
            @"{
                RawValue: 'Overwritten',
                CtxHierarchy: 'default',
                NestedJson: 'default',
            }",
        },

        // Should merge JSON correctly according to priorities
        new object[]
        {
            TestVarCtx.Get(environment: "prod"), @"{
                NestedJson: { Winner: 'Superman', Deep: { Value1: 'Hello 1', Items: [1, 2, 3] }},
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(channel: "mobile"), @"{
                NestedJson: { Winner: 'Batman', Other: 'Other value' },
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(product: "portal"), @"{
                NestedJson: { Winner: 'Chuck Norris', Deep: { Value2: 'Hello 2', Items: [11, 22] } },
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(environment: "prod", channel: "mobile"), @"{
                NestedJson: { Winner: 'Batman', Other: 'Other value', Deep: { Value1: 'Hello 1', Items: [1, 2, 3] } },
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(environment: "prod", product: "portal"), @"{
                NestedJson: { Winner: 'Chuck Norris', Deep: { Value1: 'Hello 1', Value2: 'Hello 2', Items: [11, 22] } },
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(channel: "mobile", product: "portal"), @"{
                NestedJson: { Winner: 'Chuck Norris', Other: 'Other value', Deep: { Value2: 'Hello 2', Items: [11, 22] } },
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(environment: "prod", channel: "mobile", product: "portal"), @"{
                NestedJson: { Winner: 'Chuck Norris', Other: 'Other value', Deep: { Value1: 'Hello 1', Value2: 'Hello 2', Items: [11, 22] } },
                CtxHierarchy: 'default',
                RawValue: 'default',
            }",
        },

        // Should merge according to context hierarchy
        new object[]
        {
            TestVarCtx.Get(environment: new[] { "qa", "qa2", "dev" }), @"{
                CtxHierarchy: { Value1: 'qa', Value2: 'qa', Value3: 'qa' },
                NestedJson: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(environment: new[] { "qa2", "dev" }), @"{
                CtxHierarchy: { Value1: 'qa2', Value2: 'qa2', Value3: 'qa' },
                NestedJson: 'default',
                RawValue: 'default',
            }",
        },
        new object[]
        {
            TestVarCtx.Get(environment: new[] { "dev" }), @"{
                CtxHierarchy: { Value1: null, Value2: 'qa2', Value3: 'qa' },
                NestedJson: 'default',
                RawValue: 'default',
            }",
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    internal void ShouldBuildJson(VariationContext context, string expectedJson)
    {
        var dto = new Dictionary<string, KeyConfiguration>
        {
            ["CtxHierarchy"] = new KeyConfiguration("type", new[]
            {
                TestValueConfig.GetJson("{ Value1: 'qa2', Value2: 'qa2' }", environment: "qa2", priority: 2),
                TestValueConfig.GetJson("{ Value1: null }", environment: "dev", priority: 3),
                TestValueConfig.GetJson("{ Value1: 'qa', Value2: 'qa', Value3: 'qa' }", environment: "qa", priority: 1),
                TestValueConfig.Get("default", priority: 0),
            }),
            ["NestedJson"] = new KeyConfiguration("type", new[]
            {
                TestValueConfig.GetJson("{ Winner: 'Chuck Norris', Deep: { Value2: 'Hello 2', Items: [11, 22] } }", product: "portal"),
                TestValueConfig.GetJson("{ Winner: 'Batman', Other: 'Other value' }", channel: "mobile"),
                TestValueConfig.GetJson("{ Winner: 'Superman', Deep: { Value1: 'Hello 1', Items: [1, 2, 3] } }", environment: "prod"),
                TestValueConfig.Get("default"),
            }),
            ["RawValue"] = new KeyConfiguration("type", new[]
            {
                TestValueConfig.Get("Overwritten", label: "bwin.es"),
                TestValueConfig.Get("default"),
            }),
        };
        var ctxHierarchy = new VariationHierarchyResponse(new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            ["environment"] = new Dictionary<string, string>
            {
                { "qa", null },
                { "qa2", "qa" },
                { "dev", "qa2" },
            },
            ["product"] = new Dictionary<string, string>(),
            ["label"] = new Dictionary<string, string>(),
            ["channel"] = new Dictionary<string, string>(),
        });
        IInstanceJsonBuilder target = new InstanceJsonBuilder();

        // Act
        var json = target.BuildForContext(dto, context, ctxHierarchy);

        json.Should().BeJson(expectedJson);
    }
}
