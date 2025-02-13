using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json;

public sealed class JObjectExtensionsTests
{
    [Theory]
    [InlineData("Property", StringComparison.Ordinal)]
    [InlineData("properTY", StringComparison.OrdinalIgnoreCase)]
    public void Get_ShouldGetProperty(string propertyName, StringComparison comparison)
    {
        var json = JObject.Parse("{ Property: { Test: 123 }}");

        // Act
        var result = json.Get<JObject>(propertyName, comparison);

        result.Should().BeJson("{ Test: 123 }");
    }

    [Theory]
    [InlineData("Property", StringComparison.Ordinal)]
    [InlineData("properTY", StringComparison.OrdinalIgnoreCase)]
    public void GetOrAdd_ShouldGetExistingProperty(string propertyName, StringComparison comparison)
    {
        var json = JObject.Parse("{ Property: { Test: 123 }}");

        // Act
        var result = json.GetOrAdd<JObject>(propertyName, comparison);

        result.Should().BeJson("{ Test: 123 }");
        json.Should().BeJson("{ Property: { Test: 123 }}");
    }

    [Theory]
    [InlineData("{}", StringComparison.OrdinalIgnoreCase, "{ Test: {} }")]
    [InlineData("{ test: 123 }", StringComparison.Ordinal, "{ test: 123, Test: {} }")]
    public void GetOrAdd_ShouldCreateNewProperty(string inputJson, StringComparison comparison, string expectedJson)
    {
        var json = JObject.Parse(inputJson);

        // Act
        var result = json.GetOrAdd<JObject>("Test", comparison);

        result.Should().BeJson("{}");
        json.Should().BeJson(expectedJson);
    }

    [Theory]
    [InlineData("{ Test: 123, test: 456 }", StringComparison.Ordinal, "{ Test: 666, test: 456 }")]
    [InlineData("{ Test: 123, test: 456, other: 789 }", StringComparison.OrdinalIgnoreCase, "{ Test: 666, other: 789 }")]
    public void Set_ShouldSetProperty(string inputJson, StringComparison comparison, string expectedJson)
    {
        var json = JObject.Parse(inputJson);

        // Act
        json.Set("Test", comparison, new JValue(666));

        json.Should().BeJson(expectedJson);
    }

    [Theory]
    [InlineData("{ Test: 123, test: 456 }", StringComparison.Ordinal, "{ test: 456 }")]
    [InlineData("{ Test: 123, test: 456, other: 789 }", StringComparison.OrdinalIgnoreCase, "{ other: 789 }")]
    public void Remove_ShouldRemoveProperty(string inputJson, StringComparison comparison, string expectedJson)
    {
        var json = JObject.Parse(inputJson);

        // Act
        json.Remove("Test", comparison);

        json.Should().BeJson(expectedJson);
    }
}
