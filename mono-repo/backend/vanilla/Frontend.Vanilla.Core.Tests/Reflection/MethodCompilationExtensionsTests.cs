using System;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public sealed class MethodCompilationExtensionsTests
{
    public abstract class Foo
    {
        public abstract string Method(string arg1, int arg2, object arg3);
        public abstract string GenericMethod<T1, T2>();
        public abstract int ValueTypeMethod();
        public abstract void VoidMethod();
        public static string StaticMethod(string s1, string s2) => s1 + s2;
        public static void StaticVoidMethod(IDisposable disposable) => disposable.Dispose();
        public abstract int GetValue();
    }

    [Fact]
    public void Compile_ShouldCallMethod()
    {
        var foo = Mock.Of<Foo>(f => f.Method("abc", 123, typeof(bool)) == "result");
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.Method));

        // Act
        var func = method.Compile();

        func(foo, "abc", 123, typeof(bool)).Should().Be("result");
    }

    [Fact]
    public void Compile_ShouldCallGenericMethod()
    {
        var foo = Mock.Of<Foo>(f => f.GenericMethod<string, int>() == "result");
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.GenericMethod)).MakeGenericMethod(typeof(string), typeof(int));

        // Act
        var func = method.Compile();

        func(foo).Should().Be("result");
    }

    [Fact]
    public void Compile_ShouldCallValueTypeMethod()
    {
        var foo = Mock.Of<Foo>(f => f.ValueTypeMethod() == 123);
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.ValueTypeMethod));

        // Act
        var func = method.Compile();

        func(foo).Should().Be(123);
    }

    [Fact]
    public void Compile_ShouldCallVoidMethod()
    {
        var foo = new Mock<Foo>();
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.VoidMethod));

        // Act
        var func = method.Compile();

        func(foo.Object);
        foo.Verify(f => f.VoidMethod());
    }

    [Fact]
    public void Compile_ShouldCallStaticMethod()
    {
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.StaticMethod));

        // Act
        var func = method.Compile();

        func(null, "a", "b").Should().Be("ab");
    }

    [Fact]
    public void Compile_ShouldCallStaticVoidMethod()
    {
        var disposable = new Mock<IDisposable>();
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.StaticVoidMethod));

        // Act
        var func = method.Compile();

        func(null, disposable.Object);
        disposable.Verify(d => d.Dispose());
    }

    [Fact]
    public void CompileGeneric_ShouldCompileToLambda() => RunCompileLambdaTest<int>();

    [Fact]
    public void CompileGeneric_ShouldUpcatResult() => RunCompileLambdaTest<int?>();

    [Fact]
    public void CompileGeneric_ShouldBoxValueResult() => RunCompileLambdaTest<object>();

    private void RunCompileLambdaTest<T>()
    {
        var foo = Mock.Of<Foo>(f => f.GetValue() == 66);
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.GetValue));

        // Act
        var func = method.Compile<Func<Foo, T>>();

        func(foo).Should().Be(66);
    }

    [Fact]
    public void CompileGeneric_ShouldThrow_IfNoDelegateParameters()
    {
        var method = typeof(Foo).GetRequired<MethodInfo>(nameof(Foo.GetValue));

        Action act = () => method.Compile<Func<int>>();

        act.Should().Throw()
            .Which.Message.Should().ContainAll("this", typeof(Func<int>));
    }
}
