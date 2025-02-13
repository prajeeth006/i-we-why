using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides;

public class OverridesJsonExtensionsTests
{
    [Fact]
    public void GetFeatures_ShouldReturnInnerJson()
    {
        var overridesJson = JObject.Parse("{ cONFiguration: { Foo: 123 } }"); // Should be case-insensitive

        // Act
        var features = overridesJson.GetFeatures();

        features.Should().BeJson("{ Foo: 123 }");
    }

    [Fact]
    public void GetFeatures_ShouldReturnNull_IfNoRootProperty()
    {
        var overridesJson = JObject.Parse("{ Foo: 123 }");

        // Act
        overridesJson.GetFeatures().Should().BeNull();
    }
}
