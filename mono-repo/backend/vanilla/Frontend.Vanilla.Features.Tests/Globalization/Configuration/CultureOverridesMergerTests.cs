using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Configuration;

public sealed class CultureOverridesMergerTests
{
    private ICultureOverridesMerger target;

    public CultureOverridesMergerTests()
    {
        target = new CultureOverridesMerger();
    }

    [Fact]
    public void Merger_ShouldMergeWholeMatchingOverridesChain()
    {
        var culture = new CultureInfo("en-US");
        var cultureOverrides = new Dictionary<string, JObject>
        {
            { "any", JObject.Parse(@"{""Foo"": ""blabla""}") },
            { "en", JObject.Parse(@"{""Bar"": 23, ""Baz"": {""Abc"": ""moohoo""}}") },
            { "en-US", JObject.Parse(@"{""Baz"": {""Qwerty"": true}}") },
            { "pl", JObject.Parse(@"{""Qwe"":""ughugh""}") },
            { "pl-PL", JObject.Parse(@"{""Xyz"":""abcdfegh""}") },
        }.AsReadOnly();

        var result = target.MergeOverridesChain(culture, cultureOverrides);

        result.ToString(Formatting.None).Should().Be(@"{""Foo"":""blabla"",""Bar"":23,""Baz"":{""Abc"":""moohoo"",""Qwerty"":true}}");
    }

    [Fact]
    public void Merger_ShouldIgnoreNullValues_WhenMergingExistingProperties()
    {
        var culture = new CultureInfo("en-US");
        var cultureOverrides = new Dictionary<string, JObject>
        {
            { "any", JObject.Parse(@"{""Foo"": ""abc""}") },
            { "en-US", JObject.Parse(@"{""Foo"": null}") },
        }.AsReadOnly();

        var result = target.MergeOverridesChain(culture, cultureOverrides);

        result.ToString(Formatting.None).Should().Be(@"{""Foo"":""abc""}");
    }

    [Fact]
    public void Merger_ShouldReplaceArrays()
    {
        var culture = new CultureInfo("en-US");
        var cultureOverrides = new Dictionary<string, JObject>
        {
            { "any", JObject.Parse(@"{""Foo"": [""one"",""two"",""three""]}") },
            { "en-US", JObject.Parse(@"{""Foo"": [""eins"",""zwei""]}") },
        }.AsReadOnly();

        var result = target.MergeOverridesChain(culture, cultureOverrides);

        result.ToString(Formatting.None).Should().Be(@"{""Foo"":[""eins"",""zwei""]}");
    }

    [Theory]
    [InlineData("", @"{""Foo"":""top""}")]
    [InlineData("sk-SK", @"{""Foo"":""top""}")]
    [InlineData("en", @"{""Foo"":""middle""}")]
    [InlineData("en-US", @"{""Foo"":""bottom""}")]
    [InlineData("pl-PL", @"{""Foo"":""polish-bottom""}")]
    public void Merger_ShouldMergeBasedOnCulture_AndWithMostSpecificOverrideTakingPrecedence(string cultureName, string expectedResult)
    {
        var culture = new CultureInfo(cultureName);
        var cultureOverrides = new Dictionary<string, JObject>
        {
            { "any", JObject.Parse(@"{""Foo"":""top""}") },
            { "en", JObject.Parse(@"{""Foo"":""middle""}") },
            { "en-US", JObject.Parse(@"{""Foo"":""bottom""}") },
            { "pl", JObject.Parse(@"{""Foo"":""polish-middle""}") },
            { "pl-PL", JObject.Parse(@"{""Foo"":""polish-bottom""}") },
        }.AsReadOnly();

        var result = target.MergeOverridesChain(culture, cultureOverrides);

        result.ToString(Formatting.None).Should().Be(expectedResult);
    }

    [Fact]
    public void Merger_ShouldReturnEmptyObject_WhenOverridesCollectionIsEmpty()
    {
        var result = target.MergeOverridesChain(
            new CultureInfo("en-US"),
            new Dictionary<string, JObject>().AsReadOnly());

        result.ToString(Formatting.None).Should().Be(@"{}");
    }
}
