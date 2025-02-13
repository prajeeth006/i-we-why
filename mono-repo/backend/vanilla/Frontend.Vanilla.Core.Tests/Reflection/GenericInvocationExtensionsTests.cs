using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public sealed class GenericInvocationExtensionsTests
{
    public abstract class Foo
    {
        // Should be able to pick correct method
        public abstract string Method<T1, T2, T3>(T1 arg1, int arg2);
        public abstract string Method<T1, T2>(T1 arg1, int arg2);
        public abstract string Method(string arg1, int arg2);

        public abstract void VoidMethod<T>();
        public string StaticMethod<T>() => "Result " + typeof(T);
    }

    public class PrivateFoo
    {
        private string PrivateMethod<T>() => "Result " + typeof(T);
    }

    [Fact]
    public void ShouldCallMethod()
    {
        var foo = Mock.Of<Foo>(f => f.Method<string, int, TraitAttribute>("abc", 123) == "It works!");
        var genericArgs = new[] { typeof(string), typeof(int), typeof(TraitAttribute) };
        var args = new object[] { "abc", 123 };

        // Act
        var result = foo.InvokeGeneric(nameof(Foo.Method), genericArgs, args);

        result.Should().Be("It works!");
    }

    [Fact]
    public void ShouldCallVoidMethod()
    {
        var foo = new Mock<Foo>();
        foo.Object.InvokeGeneric(nameof(Foo.VoidMethod), typeof(string)); // Act
        foo.Verify(f => f.VoidMethod<string>());
    }

    [Fact]
    public void ShouldCallStaticMethod()
    {
        var foo = Mock.Of<Foo>();
        var result = foo.InvokeGeneric(nameof(Foo.StaticMethod), typeof(string)); // Act
        result.Should().Be("Result System.String");
    }

    [Fact]
    public void ShouldCallPrivateMethod()
    {
        var foo = new PrivateFoo();
        var result = foo.InvokeGeneric("PrivateMethod", typeof(string)); // Act
        result.Should().Be("Result System.String");
    }
}
