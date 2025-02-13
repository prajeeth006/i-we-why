using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Primitives;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.D_InstanceJson;

public class PlaceholderReplacingDecoratorTests
{
    private readonly IInstanceJsonResolver target;
    private readonly Mock<IInstanceJsonResolver> inner;

    private readonly IReadOnlyDictionary<string, KeyConfiguration> featureDto;
    private readonly VariationHierarchyResponse ctxHierarchy;
    private readonly VariationContext innerResultCtx;
    private JObject innerResultJson;

    public PlaceholderReplacingDecoratorTests()
    {
        inner = new Mock<IInstanceJsonResolver>();
        var staticVarContext = new StaticVariationContext(("environment", "qa666"), ("channel", "air"));
        target = new PlaceholderReplacingDecorator(inner.Object, staticVarContext);

        featureDto = new Dictionary<string, KeyConfiguration>();
        innerResultCtx = TestVarCtx.Get(new[] { "livebetting", "sports" }, new[] { "mobile" }, priority: 666);
        ctxHierarchy = new VariationHierarchyResponse(
            new Dictionary<string, IReadOnlyDictionary<string, string>>
            {
                ["label"] = new Dictionary<string, string>
                {
                    { "bwin.com", null },
                    { "party.com", null },
                },
                ["environment"] = new Dictionary<string, string> // Should be ignored
                {
                    { "qa666", "dev" },
                },
            });
        inner.Setup(i => i.Resolve(featureDto, ctxHierarchy)).Returns(() => new[] { (innerResultJson, innerResultCtx) });
    }

    [Fact]
    public void ShouldNotReplaceAnything_IfNotPlaceholders()
    {
        SetupInnerResult("Hello world");

        var result = target.Resolve(featureDto, ctxHierarchy); // Act

        result.Should().Equal((innerResultJson, innerResultCtx));
    }

    [Fact]
    public void ShouldReplaceFromStaticContext()
    {
        SetupInnerResult("Hello ${dynacon:environment} ${dynacon:channel} world ${dynacon:environment}");

        var result = target.Resolve(featureDto, ctxHierarchy).Single(); // Act

        Verify(result, "Hello qa666 air world qa666");
        result.context.Should().BeSameAs(innerResultCtx);
    }

    [Fact]
    public void ShouldReplaceFromItemsContext_MultiplyingValues()
    {
        SetupInnerResult("Hello ${dynacon:product} and ${dynacon:product}");

        var result = target.Resolve(featureDto, ctxHierarchy).ToList(); // Act

        result.Should().HaveCount(2);
        Verify(result, "Hello livebetting and livebetting", "livebetting");
        Verify(result, "Hello sports and sports", "sports");
    }

    [Fact]
    public void ShouldReplaceFromContextHierarchy_MultiplyingValues()
    {
        SetupInnerResult("Hello ${dynacon:label} and ${dynacon:label}");

        var result = target.Resolve(featureDto, ctxHierarchy).ToList(); // Act

        result.Should().HaveCount(2);
        Verify(result, "Hello bwin.com and bwin.com", new[] { "livebetting", "sports" }, "bwin.com");
        Verify(result, "Hello party.com and party.com", new[] { "livebetting", "sports" }, "party.com");
    }

    [Fact]
    public void ShouldCombineReplacements_MultiplyingValues()
    {
        SetupInnerResult("Hello ${dynacon:product} at ${dynacon:label}");

        var result = target.Resolve(featureDto, ctxHierarchy).ToList(); // Act

        result.Should().HaveCount(4);
        Verify(result, "Hello sports at bwin.com", "sports", "bwin.com");
        Verify(result, "Hello sports at party.com", "sports", "party.com");
        Verify(result, "Hello livebetting at bwin.com", "livebetting", "bwin.com");
        Verify(result, "Hello livebetting at party.com", "livebetting", "party.com");
    }

    [Fact]
    public void ShouldMatchPlaceholderIgnoringCase()
    {
        SetupInnerResult("Hello ${DynaCon:ENVIronmENT} world");

        var result = target.Resolve(featureDto, ctxHierarchy); // Act

        Verify(result.Single(), "Hello qa666 world");
    }

    [Fact]
    public void ShouldReplaceInJsonArray()
    {
        innerResultJson = JObject.Parse(
            @"{ Array: [
                'Hello ${dynacon:environment} world',
                123,
                'Unproccessed',
                null,
                { Nested: '${dynacon:channel}', OtherType: 456 }
            ]}");

        var result = target.Resolve(featureDto, ctxHierarchy); // Act

        result.Single().instanceJson.Should().BeJson(
            @"{ Array: [
                'Hello qa666 world',
                123,
                'Unproccessed',
                null,
                { Nested: 'air', OtherType: 456 }
            ]}");
    }

    [Fact]
    public void ShouldReplaceInJsonObject()
    {
        innerResultJson = JObject.Parse(
            @"{
                Foo: 'Hello ${dynacon:environment}',
                Nested: { Bar: 'world ${dynacon:channel}', OtherType: 123 },
                '${dynacon:environment} property': 'xxx',
                Unproccessed: null
            }");

        var result = target.Resolve(featureDto, ctxHierarchy); // Act

        result.Single().instanceJson.Should().BeJson(
            @"{
                Foo: 'Hello qa666',
                Nested: { Bar: 'world air', OtherType: 123 },
                'qa666 property': 'xxx',
                Unproccessed: null
            }");
    }

    [Fact]
    public void ShouldThrow_IfUnsupportedPlaceholder()
        => RunExceptionTest(
            "Hello ${dynacon:wtf} world",
            expectedMsg: "Unsupported (unknown) variation context property used in a placeholder '${dynacon:wtf}'."
                         + " Available static properties: 'environment', 'channel' and dynamic properties: 'label', 'environment'.");

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(" not trimmed")]
    public void ShouldThrow_IfInvalidPlaceholderSyntax(string value)
        => RunExceptionTest(
            "Hello ${dynacon:" + value + "} world",
            expectedMsg: "Variation context property name inside a placeholder must be a trimmed non-empty string e.g. '${dynacon:FooBar}' but there is '${dynacon:" +
                         value + "}'.");

    [Fact]
    public void ShouldThrow_IfUnclosedPlaceholder()
        => RunExceptionTest(
            "Hello ${dynacon:label but unclosed",
            expectedMsg: "Unclosed (missing closing '}') placeholder from position 6 with text: ${dynacon:label but unclosed");

    private void RunExceptionTest(string strToReplace, string expectedMsg)
    {
        SetupInnerResult(strToReplace);

        Func<object> act = () => target.Resolve(featureDto, ctxHierarchy).ToList(); // Act

        var agex = act.Should().Throw<AggregateException>().Which;
        var ex = (InstanceDeserializationException)agex.InnerExceptions.Single();
        ex.Context.Should().BeSameAs(innerResultCtx);
        ex.InnerException?.Message.Should().Be(expectedMsg);
    }

    private void SetupInnerResult(string strToReplace)
        => innerResultJson = JObject.Parse("{ Foo: '" + strToReplace + "' }");

    private static void Verify(
        IEnumerable<(JObject instanceJson, VariationContext context)> result,
        string expectedReplaced,
        StringValues product,
        StringValues label = default)
    {
        var item = result.Should().Contain(i => i.context.Equals(TestVarCtx.Get(product, new[] { "mobile" }, label, default, 666))).Subject;
        Verify(item, expectedReplaced);
    }

    private static void Verify((JObject instanceJson, VariationContext context) item, string expectedReplaced)
        => item.instanceJson.Should().BeJson("{ Foo: '" + expectedReplaced + "' }");
}
