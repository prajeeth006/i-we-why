using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Proxy;

public class RoslynProxyCodeGeneratorTests
{
    private readonly IRoslynProxyCodeGenerator target;
    private readonly Mock<IRoslynProxyBuilder> builder;

    public RoslynProxyCodeGeneratorTests()
    {
        target = RoslynProxyCodeGenerator.Singleton;
        builder = new Mock<IRoslynProxyBuilder>();

        builder.SetupGet(b => b.InterfaceToProxy).Returns(typeof(IFoo));
        builder.SetupGet(b => b.ClassNameInfix).Returns("Retard");
        builder.SetupGet(b => b.Fields).Returns(new Dictionary<Type, TrimmedRequiredString>());
        builder.SetupWithAnyArgs(b => b.GetPropertyGetterCode(null)).Returns("getter\r\ncode");
        builder.SetupWithAnyArgs(b => b.GetPropertySetterCode(null)).Returns("setter\r\ncode");
        builder.SetupWithAnyArgs(b => b.GetMethodCode(null)).Returns("method\r\ncode");
    }

    public interface IFooParent
    {
        Task<T> Generic<T>(IEnumerable<T> args, string str);
    }

    public interface IFoo : IFooParent
    {
        string GetterProp { get; }
        string SetterProp { set; }
        int NonGeneric(out string outParam);
    }

    [Fact(Skip = "regex doesnt match *")]
    public void ShouldGenerateCodeCorrectly()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("en-US"));
        RunAndExpectCode("""
                         namespace Frontend.Vanilla.RoslynProxy
                         {
                             internal sealed class FooRetard4 : Frontend.Vanilla.Core.Tests.Reflection.Proxy.RoslynProxyCodeGeneratorTests.IFoo
                             {
                                 System.Threading.Tasks.Task<T> Frontend.Vanilla.Core.Tests.Reflection.Proxy.RoslynProxyCodeGeneratorTests.IFooParent.Generic<T>(
                                     System.Collections.Generic.IEnumerable<T> args,
                                     System.String str)
                                 {
                                     method
                                     code
                                 }
                         
                                 public System.String GetterProp
                                 {
                                     get
                                     {
                                         getter
                                         code
                                     }
                                 }
                         
                                 System.Int32 Frontend.Vanilla.Core.Tests.Reflection.Proxy.RoslynProxyCodeGeneratorTests.IFoo.NonGeneric(
                                     out System.String outParam)
                                 {
                                     method
                                     code
                                 }
                         
                                 public System.String SetterProp
                                 {
                                     set
                                     {
                                         setter
                                         code
                                     }
                                 }
                         
                             }
                         }
                         
                         """);
        builder.Verify(b => b.GetPropertyGetterCode(It.Is<PropertyInfo>(p => p.Name == nameof(IFoo.GetterProp))));
        builder.Verify(b => b.GetPropertySetterCode(It.Is<PropertyInfo>(p => p.Name == nameof(IFoo.SetterProp))));
        builder.Verify(b => b.GetMethodCode(It.Is<MethodInfo>(m => m.Name == nameof(IFoo.NonGeneric))));
        builder.Verify(b => b.GetMethodCode(It.Is<MethodInfo>(m => m.Name == nameof(IFooParent.Generic))));
    }

    public interface IEmptyFoo { }

    [Fact(Skip = "regex doesnt match *")]
    public void ShouldGenerateFieldsWithConstructor()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("en-US"));
        builder.SetupGet(b => b.InterfaceToProxy).Returns(typeof(IEmptyFoo));
        builder.SetupGet(b => b.Fields).Returns(new Dictionary<Type, TrimmedRequiredString>
        {
            { typeof(string), "name" },
            { typeof(int), "count" },
        });

        RunAndExpectCode("""
                         namespace Frontend.Vanilla.RoslynProxy
                         {
                             internal sealed class EmptyFooRetard* : Frontend.Vanilla.Core.Tests.Reflection.Proxy.RoslynProxyCodeGeneratorTests.IEmptyFoo
                             {
                                 private readonly System.String name;
                                 private readonly System.Int32 count;
                         
                                 public EmptyFooRetard*(
                                     System.String name,
                                     System.Int32 count)
                                 {
                                     this.name = name;
                                     this.count = count;
                                 }
                         
                             }
                         }

                         """);
    }

    private void RunAndExpectCode(string expectedCode)
    {
        // Act
        var code = target.GenerateClassCode(builder.Object);

        // Assert
        code.Should().Match(expectedCode);
    }

    [Fact]
    public void ShouldThrow_IfFailedMemberProcessing()
    {
        builder.SetupWithAnyArgs(b => b.GetMethodCode(null)).Throws(new Exception("Oups"));
        RunExceptionTest(
            expectedException: new[] { nameof(IFoo.Generic), typeof(IFoo).ToString(), "(Method)" },
            expectedInnerException: "Oups");
    }

    public interface IUnsupportedMemberFoo
    {
        event EventHandler LoggedIn;
    }

    [Fact]
    public void ShouldThrow_IfUnsupportedMember()
    {
        builder.SetupGet(b => b.InterfaceToProxy).Returns(typeof(IUnsupportedMemberFoo));
        RunExceptionTest(
            expectedException: new[] { nameof(IUnsupportedMemberFoo.LoggedIn), "(Event)" },
            expectedInnerException: "supported");
    }

    private void RunExceptionTest(string[] expectedException, string expectedInnerException)
    {
        Action act = () => target.GenerateClassCode(builder.Object); // Act

        var ex = act.Should().Throw().Which;
        ex.Message.Should().ContainAll(expectedException);
        ex.InnerException?.Message.Should().Contain(expectedInnerException);
    }
}
