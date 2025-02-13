using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public sealed class CustomAttributeProviderExtensionsTests
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class FooAttribute : Attribute
    {
        public string Value { get; set; }
    }

    [Foo(Value = "Star Wars: A New Hope")]
    [Foo(Value = "Star Wars: The Empire Strikes Back")]
    public class TestModel { }

    [Fact]
    public void Get_ShouldGetFirstAttributeOfParticularType()
    {
        // Act
        var attr = typeof(TestModel).Get<FooAttribute>();

        attr.Value.Should().StartWith("Star Wars"); // Order of attributes is undefined
    }

    [Fact]
    public void Get_ShouldGetNull_IfAttributeNotExist()
        => typeof(TestModel).Get<TraitAttribute>().Should().BeNull();

    [Fact]
    public void GetRequired_ShouldGetFirstAttributeOfParticularType()
    {
        // Act
        var attr = typeof(TestModel).GetRequired<FooAttribute>();

        attr.Value.Should().StartWith("Star Wars"); // Order of attributes is undefined
    }

    [Fact]
    public void GetRequired_ShouldGetNull_IfAttributeNotExist()
    {
        Action act = () => typeof(TestModel).GetRequired<TraitAttribute>();

        act.Should().Throw()
            .Which.Message.Should().ContainAll("mandatory", typeof(TraitAttribute), typeof(TestModel), "System.RuntimeType");
    }

    [Fact]
    public void Has_ShouldReturnTrue_IfAttributeOfParticularTypeExists()
        => typeof(TestModel).Has<FooAttribute>().Should().BeTrue();

    [Fact]
    public void Has_ShouldReturnFalse_IfNoAttributeOfParticularTypeDoesNotExist()
        => typeof(TestModel).Has<TraitAttribute>().Should().BeFalse();
}
