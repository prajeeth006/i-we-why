using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.B_Feature;

public class ValuesOptimizationDecoratorTests
{
    private IFeatureDeserializer target;
    private Mock<IFeatureDeserializer> inner;

    private IConfigurationInfo info;
    private VariationHierarchyResponse ctxHierarchy;
    private WithWarnings<IReadOnlyList<FeatureConfiguration>> innerResult;

    public ValuesOptimizationDecoratorTests()
    {
        inner = new Mock<IFeatureDeserializer>();
        target = new ValuesOptimizationDecorator(inner.Object);

        info = Mock.Of<IConfigurationInfo>();
        ctxHierarchy = TestCtxHierarchy.Get();
        innerResult = Mock.Of<IReadOnlyList<FeatureConfiguration>>().WithWarnings("Warn 1", "Warn 2");

        inner.SetupWithAnyArgs(i => i.Deserialize(null, null, null)).Returns(innerResult);
    }

    [Fact]
    public void ShouldDropUselessValues()
    {
        var testCtx = new Dictionary<string, string> { { "HeroClass", "Warrior" } };
        var fooDto = new KeyConfiguration("type1", new[]
        {
            new ValueConfiguration(11, testCtx, priority: 101),
            new ValueConfiguration(new JValue(22), testCtx, priority: 103),
            new ValueConfiguration("dropped-b/c-priority-below-any", testCtx, priority: 99),
            new ValueConfiguration(new JArray(1, 2, 3), testCtx, priority: 102),
            new ValueConfiguration("last-b/c-any", new Dictionary<string, string>(), priority: 100),
            new ValueConfiguration(JObject.Parse("{ prop: 'dropped-b/c-priority-below-any' }"), new Dictionary<string, string>(), priority: 98),
        });
        var barDto = new KeyConfiguration("type2", new[]
        {
            new ValueConfiguration(JObject.Parse("{ prop: 11 }"), testCtx, priority: 101),
            new ValueConfiguration("any-but-ignored-b/c-json-with-higher-priority", new Dictionary<string, string>(), priority: 100),
            new ValueConfiguration("abc", testCtx, priority: 98),
            new ValueConfiguration(11, testCtx, priority: 97),
        });
        var featureDto = new Dictionary<string, KeyConfiguration> { { "Foo", fooDto }, { "Bar", barDto } };

        // Act
        var result = target.Deserialize(info, featureDto, ctxHierarchy);

        result.Should().BeEquivalentTo(innerResult);
        inner.Verify(i => i.Deserialize(info, It.IsAny<IReadOnlyDictionary<string, KeyConfiguration>>(), ctxHierarchy));
        inner.Invocations.Single().Arguments[1].Should().BeEquivalentTo(new Dictionary<string, KeyConfiguration>
        {
            ["Foo"] = new KeyConfiguration("type1", new[]
            {
                new ValueConfiguration(11, testCtx, priority: 101),
                new ValueConfiguration(new JValue(22), testCtx, priority: 103),
                new ValueConfiguration(new JArray(1, 2, 3), testCtx, priority: 102),
                new ValueConfiguration("last-b/c-any", new Dictionary<string, string>(), priority: 100),
            }),
            ["Bar"] = barDto,
        });
    }
}
