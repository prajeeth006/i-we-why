using System;
using System.Collections.Generic;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Delegator;

public class DelegatorProxyBuilderTests
{
    private DelegatorProxyBuilder target;

    public DelegatorProxyBuilderTests()
        => target = new DelegatorProxyBuilder(typeof(IFoo), typeof(IDelegated));

    public interface IFoo
    {
        int TestProp { get; set; }
        T GenericMethod<T>(List<T> args, int count);
        void VoidMethod();
    }

    public interface IDelegated { }

    [Fact]
    public void InterfaceToProxy_ShouldExposeTargetType()
        => target.InterfaceToProxy.Should().Be(typeof(IFoo));

    [Fact]
    public void ClassNameInfix_ShouldBeValid()
        => target.ClassNameInfix.Should().NotBeNull();

    [Fact]
    public void DelegatedType_ShouldBeCorrect()
        => target.DelegatedType.Should().Be(typeof(IDelegated));

    [Fact]
    public void DelegatedType_ShouldFallbackToProxyInterface_IfNotProvided()
    {
        target = new DelegatorProxyBuilder(typeof(IFoo));
        target.DelegatedType.Should().Be(typeof(IFoo));
    }

    [Fact]
    public void Fields_ShouldAcceptDelegator()
        => target.Fields.Should().HaveCount(1)
            .And.Contain(typeof(IProxyDelegator), "delegator");

    [Fact]
    public void GetPropertyGetterCode_ShouldGetCorrectCode()
    {
        var property = typeof(IFoo).GetRequired<PropertyInfo>(nameof(IFoo.TestProp));

        var code = target.GetPropertyGetterCode(property); // Act

        code.Should().Be(
            $"var target = (Frontend.Vanilla.Core.Tests.Reflection.Delegator.DelegatorProxyBuilderTests.IDelegated)delegator.ResolveTarget(\"get_TestProp\");{Environment.NewLine}"
            + "return target.TestProp;");
    }

    [Fact]
    public void GetPropertySetterCode_ShouldGetCorrectCode()
    {
        var property = typeof(IFoo).GetRequired<PropertyInfo>(nameof(IFoo.TestProp));

        var code = target.GetPropertySetterCode(property); // Act

        code.Should().Be(
            $"var target = (Frontend.Vanilla.Core.Tests.Reflection.Delegator.DelegatorProxyBuilderTests.IDelegated)delegator.ResolveTarget(\"set_TestProp\");{Environment.NewLine}"
            + "target.TestProp = value;");
    }

    [Fact]
    public void GetMethodCode_ShouldGetCorrectCode_IfGeneric()
    {
        var method = typeof(IFoo).GetRequired<MethodInfo>(nameof(IFoo.GenericMethod));

        var code = target.GetMethodCode(method); // Act

        code.Should().Be(
            $"var target = (Frontend.Vanilla.Core.Tests.Reflection.Delegator.DelegatorProxyBuilderTests.IDelegated)delegator.ResolveTarget(\"GenericMethod\");{Environment.NewLine}"
            + "return target.GenericMethod<T>(args, count);");
    }

    [Fact]
    public void GetMethodCode_ShouldGetCorrectCode_IfVoid()
    {
        var method = typeof(IFoo).GetRequired<MethodInfo>(nameof(IFoo.VoidMethod));

        var code = target.GetMethodCode(method); // Act

        code.Should().Be(
            $"var target = (Frontend.Vanilla.Core.Tests.Reflection.Delegator.DelegatorProxyBuilderTests.IDelegated)delegator.ResolveTarget(\"VoidMethod\");{Environment.NewLine}"
            + "target.VoidMethod();");
    }
}
