using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class ConfigurationImplementationParameterTests
{
    public class Foo
    {
        public Foo(int parameter, [JsonProperty("This is renamed")] long renamedParameter) { }

        public static string StaticProperty { get; set; }
        public string IntanceProperty { get; set; }
        public int PrivateSetterProperty { get; private set; }
        public int ReadOnlyProperty { get; } = 123;

        [JsonIgnore]
        public int IgnoredProperty { get; set; }

        [JsonProperty("Also renamed")]
        public int RenamedProperty { get; set; }
    }

    [Fact]
    public void GetAll_ShouldCollectAllPropertiesAndConstructorParameters()
    {
        var result = ConfigurationImplementationParameter.GetAll(typeof(Foo));

        result.Should().MatchItems(
            p => p.Name == "parameter" && p.Type == typeof(int) && p.Source == ConfigurationParameterSource.Constructor,
            p => p.Name == "This is renamed" && p.Type == typeof(long) && p.Source == ConfigurationParameterSource.Constructor,
            p => p.Name == "IntanceProperty" && p.Type == typeof(string) && p.Source == ConfigurationParameterSource.Property,
            p => p.Name == "Also renamed" && p.Type == typeof(int) && p.Source == ConfigurationParameterSource.Property);
    }

    public class NoPublicConstructorClass
    {
        public int SomeProperty { get; set; }

        private NoPublicConstructorClass() { }
    }

    [Fact]
    public void GetAll_ShouldHandleNoConstructor()
    {
        var result = ConfigurationImplementationParameter.GetAll(typeof(NoPublicConstructorClass));
        result.Select(p => p.Name).Should().Equal("SomeProperty");
    }

    public class ExplicitContructorClass
    {
        public ExplicitContructorClass(string firstName, string lastName) { }

        [JsonConstructor]
        public ExplicitContructorClass(int value) { }
    }

    [Fact]
    public void GetAll_ShouldHanldeExplicitConstructor()
    {
        var result = ConfigurationImplementationParameter.GetAll(typeof(ExplicitContructorClass));
        result.Select(p => p.Name).Should().Equal("value");
    }

    [Theory]
    [InlineData(typeof(Dictionary<string, string>))]
    [InlineData(typeof(DynamicObject))]
    [InlineData(typeof(ExpandoObject))]
    public void GetAll_ShouldReturnNullIfUnableToDeterminePropertiesUpfront(Type type)
        => ConfigurationImplementationParameter.GetAll(type).Should().BeNull();
}
