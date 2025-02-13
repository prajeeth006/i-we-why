using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Moq;
using Xunit;
using DescriptionAttribute = System.ComponentModel.DescriptionAttribute;

// ObsoleteAttribite is being tested :-)
#pragma warning disable 618
#pragma warning disable 612

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public class ProviderMembersTests
{
    [TestDescription]
    public interface ISupportedTypesDslProvider
    {
        [TestDescription]
        decimal Amount { get; }

        [TestDescription]
        string Text { get; }

        [TestDescription]
        bool Truth { get; }
    }

    [Fact]
    public void ShouldDiscover_AllSupportedTypes()
        => RunTest<ISupportedTypesDslProvider>(
            GetMember("SupportedTypes", "Amount", DslType.Number),
            GetMember("SupportedTypes", "Text", DslType.String),
            GetMember("SupportedTypes", "Truth", DslType.Boolean));

    [TestDescription]
    public interface IFuncDslProvider
    {
        [TestDescription]
        string GetText1();

        [TestDescription]
        Task<string> GetText2Async(ExecutionMode mode);

        [TestDescription]
        string Get(string name);

        [TestDescription]
        Task<string> CalculateAsync(ExecutionMode mode, string str, decimal num);
    }

    [Fact]
    public void ShouldDiscover_Functions()
        => RunTest<IFuncDslProvider>(
            GetMember("Func", "Text1"),
            GetMember("Func", "Text2"),
            GetMember("Func", "Get", parameters: new[]
            {
                new ProviderMemberParameter(DslType.String, new Identifier("name")),
            }),
            GetMember("Func", "Calculate", parameters: new[]
            {
                new ProviderMemberParameter(DslType.String, new Identifier("str")),
                new ProviderMemberParameter(DslType.Number, new Identifier("num")),
            }));

    [TestDescription]
    public interface IOverloadsDslProvider
    {
        [TestDescription]
        void Calculate();

        [TestDescription]
        Task<string> CalculateAsync(ExecutionMode mode, string str);

        [TestDescription]
        string Calculate(decimal num, string name);
    }

    [Fact]
    public void ShouldDiscover_Overloads()
        => RunTest<IOverloadsDslProvider>(
            GetMember("Overloads", "Calculate", DslType.Void),
            GetMember("Overloads", "Calculate", parameters: new[]
            {
                new ProviderMemberParameter(DslType.String, new Identifier("str")),
            }),
            GetMember("Overloads", "Calculate", parameters: new[]
            {
                new ProviderMemberParameter(DslType.Number, new Identifier("num")),
                new ProviderMemberParameter(DslType.String, new Identifier("name")),
            }));

    [TestDescription]
    public interface IActionDslProvider
    {
        [TestDescription]
        void DoSomething(decimal num);

        [TestDescription]
        Task DoSomethingElseAsync(ExecutionMode mode, string str);
    }

    [Fact]
    public void ShouldDiscover_Actions()
        => RunTest<IActionDslProvider>(
            GetMember("Action", "DoSomething", DslType.Void, parameters: new[]
            {
                new ProviderMemberParameter(DslType.Number, new Identifier("num")),
            }),
            GetMember("Action", "DoSomethingElse", DslType.Void, parameters: new[]
            {
                new ProviderMemberParameter(DslType.String, new Identifier("str")),
            }));

    [TestDescription, Obsolete("Deprecated Provider")]
    public interface IObsoleteMsgDslProvider
    {
        [TestDescription, Obsolete("Deprecated Explicitly")]
        string Value1 { get; }

        [TestDescription]
        string Value2 { get; }
    }

    [Fact]
    public void ShoulDiscover_ObsoleteMessages()
        => RunTest<IObsoleteMsgDslProvider>(
            GetMember("ObsoleteMsg", "Value1", obsoleteMessage: "Deprecated Explicitly"),
            GetMember("ObsoleteMsg", "Value2", obsoleteMessage: "Deprecated Provider"));

    [TestDescription]
    public interface IDocumentationDslProvider
    {
        [Description("Value Docs")]
        string Value { get; }
    }

    [Fact]
    public void ShoulDiscover_Documentation()
        => RunTest<IDocumentationDslProvider>(
            GetMember("Documentation", "Value", documentation: "Value Docs"));

    [TestDescription, ValueVolatility(ValueVolatility.Client)]
    public interface IExplicitVolatilityDslProvider
    {
        [TestDescription, ValueVolatility(ValueVolatility.Static)]
        string Value1 { get; }

        [TestDescription]
        string Value2 { get; }
    }

    [Fact]
    public void ShoulDiscover_ExplicitVolatility()
        => RunTest<IExplicitVolatilityDslProvider>(
            GetMember("ExplicitVolatility", "Value1", volatility: ValueVolatility.Static),
            GetMember("ExplicitVolatility", "Value2", volatility: ValueVolatility.Client));

    [TestDescription]
    public interface IClientOnlyDslProvider
    {
        [TestDescription, ClientSideOnly, ValueVolatility(ValueVolatility.Client)]
        string Value { get; }
    }

    [Fact]
    public void ShoulDiscover_ClientSideOnly()
        => RunTest<IClientOnlyDslProvider>(
            GetMember("ClientOnly", "Value", isClientSideOnly: true, volatility: ValueVolatility.Client));

    [TestDescription]
    public interface IAccessorDslProvider
    {
        [TestDescription]
        string FooProperty { get; }

        [TestDescription]
        string BarMethod(string str);
    }

    [Fact]
    public void ShouldCreateAccessorsCorrectly()
    {
        var instance = Mock.Of<IAccessorDslProvider>();
        var providers = new[] { DslValueProvider.Create(instance) };

        var propertyAccessor = Mock.Of<ProviderMemberAccessor>();
        var methodAccessor = Mock.Of<ProviderMemberAccessor>();
        var propertyGetter = typeof(IAccessorDslProvider).GetRequired<PropertyInfo>(nameof(IAccessorDslProvider.FooProperty)).GetMethod;
        var method = typeof(IAccessorDslProvider).GetRequired<MethodInfo>(nameof(IAccessorDslProvider.BarMethod));

        var accessorFactory = new Mock<IProviderMemberAccessorFactory>();
        accessorFactory.Setup(f => f.Create(propertyGetter, instance)).Returns(propertyAccessor);
        accessorFactory.Setup(f => f.Create(method, instance)).Returns(methodAccessor);

        // Act
        var members = new ProviderMembers(providers, accessorFactory.Object).Members;

        members.Single(m => m.MemberName == "FooProperty").ValueAccessor.Should().BeSameAs(propertyAccessor);
        members.Single(m => m.MemberName == "BarMethod").ValueAccessor.Should().BeSameAs(methodAccessor);
        accessorFactory.Invocations.Should().HaveCount(2);
    }

    private void RunTest<TProvider>(params ProviderMember[] expectedMembers)
        where TProvider : class
    {
        var providers = new[] { DslValueProvider.Create(Mock.Of<TProvider>()) };
        var accessorFactory = new Mock<IProviderMemberAccessorFactory>();
        accessorFactory.SetReturnsDefault(Mock.Of<ProviderMemberAccessor>());

        // Act
        var members = new ProviderMembers(providers, accessorFactory.Object).Members;

        members.Should().BeEquivalentTo(expectedMembers, o => o.Excluding(m => m.ValueAccessor));
    }

    private ProviderMember GetMember(
        string providerName,
        string memberName,
        DslType dslType = DslType.String,
        string documentation = null,
        ValueVolatility volatility = ValueVolatility.Server,
        string obsoleteMessage = null,
        bool isClientSideOnly = false,
        IEnumerable<ProviderMemberParameter> parameters = null)
    {
        documentation ??= new TestDescriptionAttribute().Description;

        return TestProviderMember.Get(providerName, memberName, dslType, documentation, volatility, obsoleteMessage, isClientSideOnly, parameters);
    }

    private class TestDescriptionAttribute() : DescriptionAttribute("Whatever Documentation") { }
}
