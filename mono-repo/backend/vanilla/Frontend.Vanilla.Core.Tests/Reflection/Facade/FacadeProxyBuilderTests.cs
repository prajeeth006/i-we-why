using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Facade;

public class FacadeProxyBuilderTests
{
    private readonly IRoslynProxyBuilder target = new FacadeProxyBuilder(typeof(IFoo));

    [Fact]
    public void InterfaceToProxy_ShouldExposeTargetType()
        => target.InterfaceToProxy.Should().Be(typeof(IFoo));

    [Fact]
    public void ClassNameInfix_ShouldBeValid()
        => target.ClassNameInfix.Should().NotBeNull();

    [Fact]
    public void Fields_ShouldListAllDelegatedDependencies()
    {
        var expect = new Dictionary<Type, TrimmedRequiredString>();
        expect.Add(typeof(IExecutionModeTarget), (TrimmedRequiredString)"executionModeTarget");
        expect.Add(typeof(IMethodTarget), (TrimmedRequiredString)"methodTarget");
        expect.Add(typeof(IPropTarget), (TrimmedRequiredString)"propTarget");

        target.Fields.Should().BeEquivalentTo(expect);
    }

    [Fact]
    public void GetPropertyGetterCode_ShouldDelegateToField()
    {
        var prop = GetFooMember<PropertyInfo>(nameof(IFoo.TestPropGet));

        var code = target.GetPropertyGetterCode(prop); // Act

        code.Should().Be("return propTarget.TargetPropGet;");
    }

    [Fact]
    public void GetPropertySetterCode_ShouldDelegateToField()
    {
        var prop = GetFooMember<PropertyInfo>(nameof(IFoo.TestPropSet));

        var code = target.GetPropertySetterCode(prop); // Act

        code.Should().Be("propTarget.TargetPropSet = value;");
    }

    [Theory]
    [InlineData(nameof(IFoo.Method), "return methodTarget.TargetMethod(x, y, z);")]
    [InlineData(nameof(IFoo.VoidMethod), "methodTarget.TargetVoidMethod(a, b);")]
    [InlineData(nameof(IFoo.GenericMethod), "return methodTarget.TargetGenericMethod<T1, T2>(arg1, arg2, arg3);")]
    [InlineData(nameof(IFoo.DirectExecutionModeMethod), "return executionModeTarget.Method(mode, x, y);")]
    [InlineData(nameof(IFoo.SyncExecutionModeMethod), "var mode = Frontend.Vanilla.Core.System.ExecutionMode.Sync;")]
    [InlineData(nameof(IFoo.SyncExecutionModeMethod), "var task = executionModeTarget.Method(mode, x, y);")]
    [InlineData(nameof(IFoo.SyncExecutionModeMethod), "return Frontend.Vanilla.Core.System.ExecutionMode.ExecuteSync(task);")]
    [InlineData(nameof(IFoo.AsyncExecutionModeMethod), "var mode = Frontend.Vanilla.Core.System.ExecutionMode.Async(cancellationToken);")]
    [InlineData(nameof(IFoo.AsyncExecutionModeMethod), "return executionModeTarget.Method(mode, x, y);")]
    public void GetMethodCode_ShouldDelegateToField(string methodToTest, string expectedCode)
    {
        var method = GetFooMember<MethodInfo>(methodToTest);

        var code = target.GetMethodCode(method); // Act
        Assert.Contains(expectedCode, code);
    }

    [Theory]
    [InlineData(nameof(IFoo.NonExistentTargetMethod), "NotExist", "(empty)")]
    [InlineData(nameof(IFoo.MultipleTargetsMethod), nameof(IMethodTarget.TargetConflict), "Void TargetConflict(), Void TargetConflict(Int32)")]
    public void GetMethodCode_ShouldThrow_IfNotSingleTargetMethod(string methodToTest, string reportedMethod, string reportedConflicts)
        => RunGetMethodCodeErrorTest(methodToTest, expectedError: "There must be a single target method according to specified"
                                                                  + $" [DelegateTo({typeof(IMethodTarget)}, '{reportedMethod}')] but there are: {reportedConflicts}.");

    [Theory]
    [InlineData(nameof(IFoo.ParameterTypeMismatch), "Parameter types of facade vs. target method must match (including order) directly but they do not."
                                                    + "\r\nExpected target parameters: System.Int32\r\nActual target parameters: System.String")]
    [InlineData(nameof(IFoo.ParameterNameMismatch), "Parameter types and names of facade vs. target method must match (including order) directly but they do not."
                                                    + "\r\nExpected target parameters: System.Int32 x\r\nActual target parameters: System.Int32 y")]
    [InlineData(nameof(IFoo.GenericParameterMismatch), "Generic parameters with their constraints of facade and target method must match in particular order."
                                                       + "\r\nFacade generic parameters: T1\r\nTarget generic parameters: T2")]
    public void GetMethodCode_ShouldThrow_IfParametersMismatch(string methodToTest, string expectedError)
        => RunGetMethodCodeErrorTest(methodToTest, expectedError);

    private void RunGetMethodCodeErrorTest(string methodToTest, string expectedError)
    {
        var method = GetFooMember<MethodInfo>(methodToTest);

        Action act = () => target.GetMethodCode(method); // Act

        act.Should().Throw().WithMessage(expectedError);
    }

    private static TMember GetFooMember<TMember>(string memberName)
        where TMember : MemberInfo
        => (TMember)typeof(IFoo).GetMember(memberName).Single();

    private interface IFoo
    {
        [DelegateTo(typeof(IPropTarget), nameof(IPropTarget.TargetPropGet))]
        string TestPropGet { get; }

        [DelegateTo(typeof(IPropTarget), nameof(IPropTarget.TargetPropSet))]
        string TestPropSet { set; }

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetMethod))]
        string Method(int x, int y, string z);

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetVoidMethod))]
        void VoidMethod(object a, object b);

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetGenericMethod))]
        List<T1> GenericMethod<T1, T2>(T1 arg1, T2 arg2, string arg3);

        [DelegateTo(typeof(IExecutionModeTarget), nameof(IExecutionModeTarget.Method))]
        Task<string> DirectExecutionModeMethod(ExecutionMode mode, int x, string y);

        [DelegateTo(typeof(IExecutionModeTarget), nameof(IExecutionModeTarget.Method))]
        string SyncExecutionModeMethod(int x, string y);

        [DelegateTo(typeof(IExecutionModeTarget), nameof(IExecutionModeTarget.Method))]
        Task<string> AsyncExecutionModeMethod(int x, CancellationToken cancellationToken, string y);

        void IgnoredDespiteNoAttributeBecauseProxyGeneratorShouldDiscoverIt();

        [DelegateTo(typeof(IMethodTarget), "NotExist")]
        void NonExistentTargetMethod();

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetConflict))]
        void MultipleTargetsMethod();

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetParameterTypeMismatch))]
        void ParameterTypeMismatch(int x);

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetParameterNameMismatch))]
        void ParameterNameMismatch(int x);

        [DelegateTo(typeof(IMethodTarget), nameof(IMethodTarget.TargetGenericParameterMismatch))]
        void GenericParameterMismatch<T1>();
    }

    private interface IPropTarget
    {
        string TargetPropGet { get; }
        string TargetPropSet { set; }
    }

    private interface IMethodTargetBase
    {
        void TargetVoidMethod(object differentNames, object thanOnFacade);
        void TargetParameterTypeMismatch(string x);
    }

    private interface IMethodTarget : IMethodTargetBase
    {
        string TargetMethod(int x, int y, string z);
        List<T1> TargetGenericMethod<T1, T2>(T1 arg1, T2 arg2, string arg3);
        void TargetConflict();
        void TargetConflict(int x);
        void TargetParameterNameMismatch(int y);
        void TargetGenericParameterMismatch<T2>();
    }

    private interface IExecutionModeTarget
    {
        Task<string> Method(ExecutionMode mode, int x, string y);
    }
}
