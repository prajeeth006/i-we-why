using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Moq;
using Xunit;
using ActionFluentAssertions = Frontend.Vanilla.Testing.FluentAssertions.ActionFluentAssertions;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public class ProviderMemberTests
{
    [Theory]
    [InlineData(DslType.Boolean, ValueVolatility.Client, null, false)]
    [InlineData(DslType.Boolean, ValueVolatility.Client, null, true)]
    [InlineData(DslType.String, ValueVolatility.Server, null, true)]
    [InlineData(DslType.Void, ValueVolatility.Static, "msg", true)]
    [InlineData(DslType.String, ValueVolatility.Server, "msg", true)]
    internal void ShouldCreateInstance(
        DslType dslType,
        ValueVolatility volatility,
        string obsoleteMsgStr,
        bool hasParams)
    {
        var providerName = new Identifier("Foo");
        var memberName = new Identifier("Bar");
        var parameters = hasParams ? new[] { new ProviderMemberParameter(DslType.Boolean, new Identifier("arg")) } : Array.Empty<ProviderMemberParameter>();
        var obsoleteMsg = obsoleteMsgStr?.AsTrimmedRequired();
        var accessor = Mock.Of<ProviderMemberAccessor>();

        // Act
        var target = new ProviderMember(providerName, memberName, dslType, parameters, "Docs", volatility, obsoleteMsg, false, accessor, false);

        target.ProviderName.Should().BeSameAs(providerName);
        target.MemberName.Should().BeSameAs(memberName);
        target.DslType.Should().Be(dslType);
        target.Parameters.Should().Equal(parameters);
        target.Documentation.Should().Be("Docs");
        target.Volatility.Should().Be(volatility);
        target.ObsoleteMessage.Should().Be(obsoleteMsg);
        target.ValueAccessor.Should().BeSameAs(accessor);
        target.SkipInitialValueGetOnDslPage.Should().BeFalse();
    }

    [Theory]
    [InlineData(ValueVolatility.Client, false)]
    [InlineData(ValueVolatility.Server, true)]
    [InlineData(ValueVolatility.Static, true)]
    public void ShouldThrowIfClientSideOnlyAndNonClientVolatility(ValueVolatility volatility, bool throws)
    {
        Action act = () => new ProviderMember(
            new Identifier("Foo"),
            new Identifier("Bar"),
            DslType.String,
            Array.Empty<ProviderMemberParameter>(),
            "Docs",
            volatility,
            null,
            true,
            Mock.Of<ProviderMemberAccessor>(),
            false);

        if (throws)
            ActionFluentAssertions.Throw(act.Should()).Where(e => e.Message.Contains("ClientSideOnly"));
        else
            act.Should().NotThrow();
    }

    public static IEnumerable<object[]> GetCreateParameterTestCases => new[]
    {
        new object[] { DslType.Boolean, "arg: Boolean" },
        new object[] { DslType.String, "arg: String" },
        new object[] { DslType.Number, "arg: Number" },
    };

    [Theory]
    [MemberData(nameof(GetCreateParameterTestCases))]
    internal void ShouldCreateParameter(DslType type, string expectedToString)
    {
        var target = new ProviderMemberParameter(type, new Identifier("arg"));

        target.Type.Should().Be(type);
        target.Name.Should().Be("arg");
        target.ToString().Should().Be(expectedToString);
    }

    [Fact]
    public void GetCreateParameterTestCases_ShouldTestAllDslTypes()
        => GetCreateParameterTestCases.Select(tc => tc[0]).Should().BeEquivalentTo(
            Enum<DslType>.Values.Except(DslType.Void));

    public static IEnumerable<object[]> ToStringTestCases => new[]
    {
        new object[] { Array.Empty<ProviderMemberParameter>(), "Foo.Bar" },
        new object[]
        {
            new[]
            {
                new ProviderMemberParameter(DslType.String, new Identifier("name")),
                new ProviderMemberParameter(DslType.Number, new Identifier("level")),
            },
            "Foo.Bar(name: String, level: Number)",
        },
    };

    [Theory]
    [MemberData(nameof(ToStringTestCases))]
    internal void ToString_ShouldOutputNames(IEnumerable<ProviderMemberParameter> parameters, string expected)
    {
        // Act
        var target = new ProviderMember(
            new Identifier("Foo"),
            new Identifier("Bar"),
            DslType.String,
            parameters,
            "Docs",
            ValueVolatility.Server,
            null,
            false,
            Mock.Of<ProviderMemberAccessor>(),
            false);

        target.ToString().Should().Be(expected);
    }
}
