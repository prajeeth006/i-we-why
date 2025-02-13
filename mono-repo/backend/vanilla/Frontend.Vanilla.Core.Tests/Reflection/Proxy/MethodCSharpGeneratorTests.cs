using System.Collections.Generic;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Proxy;

public class MethodCSharpGeneratorTests
{
    public interface IFoo
    {
        T2 GenericMethod<T1, T2>(List<T1> args, int count, ref bool isOk, out string name);
        void VoidMethod();
    }

    [Fact]
    public void ShouldGenerateCode_IfGenericMethod()
        => RunTest(
            methodToTest: nameof(IFoo.GenericMethod),
            expectedReturn: "return ",
            expectedGenerics: "<T1, T2>",
            expectedParameters: "args, count, ref isOk, out name");

    [Fact]
    public void ShouldGenerateCode_IfVoidMethod()
        => RunTest(
            methodToTest: nameof(IFoo.VoidMethod),
            expectedReturn: "",
            expectedGenerics: "",
            expectedParameters: "");

    private static void RunTest(string methodToTest, string expectedReturn, string expectedGenerics, string expectedParameters)
    {
        var method = typeof(IFoo).GetRequired<MethodInfo>(methodToTest);

        var code = MethodCSharpGenerator.Get(method); // Act

        code.Name.Should().Be(methodToTest);
        code.Return.Should().Be(expectedReturn);
        code.Generics.Should().Be(expectedGenerics);
        code.Parameters.Should().Be(expectedParameters);
    }
}
