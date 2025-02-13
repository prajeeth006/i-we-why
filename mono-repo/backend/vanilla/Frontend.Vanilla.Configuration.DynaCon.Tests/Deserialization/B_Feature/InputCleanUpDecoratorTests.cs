using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.B_Feature;

public sealed class InputCleanUpDecoratorTests
{
    private readonly IFeatureDeserializer target;
    private readonly Mock<IFeatureDeserializer> inner;
    private readonly IConfigurationInfo configInfo;
    private readonly VariationHierarchyResponse varHierarchy;

    public InputCleanUpDecoratorTests()
    {
        inner = new Mock<IFeatureDeserializer>();
        configInfo = Mock.Of<IConfigurationInfo>(i => i.FeatureName == "Vanilla.Foo");
        varHierarchy = TestCtxHierarchy.Get();
        var staticVarCtx = new StaticVariationContext(("product", "sports"), ("label", "bwin.com"), ("environment", "qa2"));
        var dynamicContextResolver = Mock.Of<IDynamicVariationContextResolver>(r => r.ProviderNames == new TrimmedRequiredString[] { "strength", "dexterity" });
        var contextExpander = new Mock<IContextHierarchyExpander>();
        target = new InputCleanUpDecorator(inner.Object, contextExpander.Object, staticVarCtx, dynamicContextResolver);

        contextExpander.SetupWithAnyArgs(e => e.GetChildren(null, null, null)).Returns(TrimmedStrs.Empty);
        contextExpander.SetupWithAnyArgs(e => e.GetParents(null, null, null)).Returns(TrimmedStrs.Empty);
        contextExpander.Setup(e => e.GetChildren(varHierarchy, "environment", "qa2")).Returns(new TrimmedRequiredString[] { "dev" });
        contextExpander.Setup(e => e.GetParents(varHierarchy, "environment", "qa2")).Returns(new TrimmedRequiredString[] { "qa", "test" });
    }

    [Fact]
    public void ShouldFilterOutInvalidValuesAndAddWarnings()
    {
        IReadOnlyDictionary<string, KeyConfiguration> receivedDto = null;
        var innerConfigs = Mock.Of<IReadOnlyList<FeatureConfiguration>>();
        var dto = new Dictionary<string, KeyConfiguration>
        {
            ["Foo"] = new ("int", new[]
            {
                new ValueConfiguration(1, validFrom: new DateTime(2001, 2, 3).ToUniversalTime(), priority: 101), // Unsupported validFrom
                new ValueConfiguration(2, validTo: new DateTime(2002, 2, 3).ToUniversalTime(), priority: 102), // Unsupported validTo
                // Ok but static product should be filtered out
                new ValueConfiguration(3, new Dictionary<string, string> { ["product"] = "sports", ["dexterity"] = "medium" }, priority: 103),
                new ValueConfiguration(4, new Dictionary<string, string> { ["product"] = "casino" }, priority: 104), // Conflicting static context - casino vs sports
                new ValueConfiguration(5, new Dictionary<string, string> { ["strength"] = "high" }, priority: 105), // Ok
                // Unsupported context - vitality
                new ValueConfiguration(6, new Dictionary<string, string> { ["vitality"] = "low", ["dexterity"] = "max" }, priority: 106),
                // Ok, parent context value - test
                new ValueConfiguration(7, new Dictionary<string, string> { ["environment"] = "test", ["strength"] = "medium" }, priority: 107),
                new ValueConfiguration(8, new Dictionary<string, string> { ["environment"] = "dev" }, priority: 108), // Useless b/c child context
                new ValueConfiguration(0, priority: 100), // Default value
            }),
            ["Bar"] = new KeyConfiguration("string", new[]
            {
                new ValueConfiguration("test", new Dictionary<string, string> { ["label"] = "bwin.com" }, priority: 10), // Default after static label is filtered out
            }),
        };
        inner.Setup(i => i.Deserialize(configInfo, It.IsAny<IReadOnlyDictionary<string, KeyConfiguration>>(), varHierarchy))
            .Returns<IConfigurationInfo, IReadOnlyDictionary<string, KeyConfiguration>, VariationHierarchyResponse>((_, d, _) =>
            {
                receivedDto = d;

                return innerConfigs.WithWarnings("Inner warning 1", "Inner warning 2");
            });

        // Act
        var result = target.Deserialize(configInfo, dto, varHierarchy);

        result.Value.Should().BeSameAs(innerConfigs);
        result.Warnings.Should().BeEquivalentTo<TrimmedRequiredString>(
            "Inner warning 1",
            "Inner warning 2",
            "Key 'Foo' contains a value with unsupported ValidFrom/ValidTo. Therefore the value is skipped.",
            "Key 'Foo' contains a value with unsupported ValidFrom/ValidTo. Therefore the value is skipped.",
            "Key \'Foo\' contains a value with properties [\"product\"] in its context {\"product\":\"casino\"} conflicting with expanded static context of this app"
            + " {\"product\":[\"sports\"],\"label\":[\"bwin.com\"],\"environment\":[\"qa\",\"test\",\"qa2\",\"dev\"]}. Therefore the value is skipped.",
            "Key \'Foo\' contains a value with unsupported properties [\"vitality\"] in its context {\"vitality\":\"low\",\"dexterity\":\"max\"}."
            + " Supported ones: [\"strength\",\"dexterity\"]. Therefore the value is skipped.");

        receivedDto.Keys.Should().BeEquivalentTo("Foo", "Bar");
        receivedDto["Foo"].DataType.Should().Be("int");
        receivedDto["Foo"].Values.Should().HaveCount(4);
        VerifyValue(receivedDto["Foo"].Values[0], 3, 103, new Dictionary<string, string> { ["dexterity"] = "medium" });
        VerifyValue(receivedDto["Foo"].Values[1], 5, 105, new Dictionary<string, string> { ["strength"] = "high" });
        VerifyValue(receivedDto["Foo"].Values[2], 7, 107, new Dictionary<string, string> { ["strength"] = "medium" });
        VerifyValue(receivedDto["Foo"].Values[3], 0, 100, new Dictionary<string, string>());
        receivedDto["Bar"].DataType.Should().Be("string");
        receivedDto["Bar"].Values.Should().HaveCount(1);
        VerifyValue(receivedDto["Bar"].Values[0], "test", 10, new Dictionary<string, string>());
    }

    private static void VerifyValue(ValueConfiguration config, object expectedValue, ulong expectedPriority, IDictionary<string, string> expectedContext)
    {
        config.Value.Should().Be(expectedValue);
        config.Priority.Should().Be(expectedPriority);
        config.Context.Should().Equal(expectedContext);
        config.ValidFrom.Should().BeNull();
        config.ValidTo.Should().BeNull();
    }

    [Fact]
    public void ShouldThrow_IfNoValueForDefaultContext()
        => RunThrowTest(
            key: "Foo",
            values: new[] { new ValueConfiguration("test", new Dictionary<string, string> { ["strength"] = "medium" }) },
            expectedError: "There must be at least one default value (applies for any or app-static context) for key 'Foo' but there are: "
                           + "{\"DataType\":\"string\",\"Values\":[{\"Value\":\"test\",\"Context\":{\"strength\":\"medium\"},\"ValidFrom\":null,\"ValidTo\":null,\"Priority\":0}],\"CriticalityLevel\":null}");

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    public void ShouldThrowIfEmptyOrWhiteSpaceKey(string key)
        => RunThrowTest(
            key,
            values: new[] { new ValueConfiguration("test") },
            expectedError: "There can't be empty nor white-space keys but the feature contains such one.");

    private void RunThrowTest(string key, ValueConfiguration[] values, string expectedError)
    {
        var dto = new Dictionary<string, KeyConfiguration> { [key] = new ("string", values) };
        Action act = () => target.Deserialize(configInfo, dto, varHierarchy);
        act.Should().Throw<Exception>().WithMessage(expectedError);
    }
}
