using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Syntactical;

public class ProviderAccessFactoryTests
{
    private IProviderAccessFactory target;

    private ProviderMember fooProp;
    private ProviderMember fooOverload1;
    private ProviderMember fooOverload2;
    private ProviderMember fooOverload3;
    private ProviderMember barFunc;

    public ProviderAccessFactoryTests()
    {
        fooProp = TestProviderMember.Get("Foo", "FooProp");
        fooOverload1 = TestProviderMember.Get("Foo", "FooOverload");
        fooOverload2 = TestProviderMember.Get("Foo", "FooOverload", parameters: new[]
        {
            new ProviderMemberParameter(DslType.String, new Identifier("name")),
        });
        fooOverload3 = TestProviderMember.Get("Foo", "FooOverload", parameters: new[]
        {
            new ProviderMemberParameter(DslType.String, new Identifier("name")),
            new ProviderMemberParameter(DslType.Number, new Identifier("level")),
        });
        barFunc = TestProviderMember.Get("Bar", "BarFunc", parameters: new[]
        {
            new ProviderMemberParameter(DslType.Number, new Identifier("num")),
            new ProviderMemberParameter(DslType.String, new Identifier("str")),
        });
        var barObsol = TestProviderMember.Get("Bar", "BarObsol", obsoleteMsg: "OMG");

        var members = new[] { fooProp, fooOverload1, fooOverload2, fooOverload3, barFunc, barObsol };
        var membersProvider = Mock.Of<IProviderMembers>(m => m.Members == members);
        target = new ProviderAccessFactory(membersProvider);
    }

    [Fact]
    public void ShouldRetrieveProperty()
    {
        // Act
        var (expr, warnings) = target.Create("Foo", "FooProp", Array.Empty<IExpressionTree>());

        expr.Should().Match<ProviderAccess>(a => a.Member == fooProp && a.Parameters.Count == 0);
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldRetrieveFunction()
    {
        var args = new[]
        {
            Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number),
            Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String),
        };

        // Act
        var (expr, warnings) = target.Create("Bar", "BarFunc", args);

        expr.Should().Match<ProviderAccess>(a => a.Member == barFunc && a.Parameters.SequenceEqual(args));
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldRetrieveCorrectOverload_WithoutParameters()
    {
        // Act
        var (expr, warnings) = target.Create("Foo", "FooOverload", Array.Empty<IExpressionTree>());

        expr.Should().Match<ProviderAccess>(a => a.Member == fooOverload1 && a.Parameters.Count == 0);
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldRetrieveCorrectOverload_WitParameters()
    {
        var args = new[] { Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String) };

        // Act
        var (expr, warnings) = target.Create("Foo", "FooOverload", args);

        expr.Should().Match<ProviderAccess>(a => a.Member == fooOverload2 && a.Parameters.SequenceEqual(args));
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldConstructCorrectWarning()
    {
        // Act
        var (_, warnings) = target.Create("Bar", "BarObsol", Array.Empty<IExpressionTree>());

        warnings.Should().Equal("DSL provider member 'Bar.BarObsol' is obsolete. Stop using it as soon as possible. OMG");
    }

    [Theory]
    [InlineData("foo")]
    [InlineData("Wtf")]
    public void ShouldThrow_IfUnknownProvider(string providerName)
        => new Action(() => target.Create(providerName, "FooProp", Array.Empty<IExpressionTree>()))
            .Should().Throw<DslArgumentException>()
            .WithMessage($"There is no DSL provider with Name '{providerName}'. Existing providers: 'Foo', 'Bar'.");

    [Theory]
    [InlineData("fooprop")]
    [InlineData("Wtf")]
    public void ShouldThrow_IfUnknownMember(string memberName)
        => new Action(() => target.Create("Foo", memberName, Array.Empty<IExpressionTree>()))
            .Should().Throw<DslArgumentException>()
            .WithMessage($"There is no member (property or function) '{memberName}' on DSL provider with Name 'Foo'. Existing members: 'FooProp', 'FooOverload'.");

    [Fact]
    public void ShouldThrow_IfInappropriateOverloadParameters()
        => new Action(() => target.Create("Foo", "FooOverload", new[] { Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number) }))
            .Should().Throw<DslArgumentException>()
            .WithMessage("There are multiple members (overloads) of 'Foo.FooOverload' but none of them has parameters as specified: Number."
                         + $" Existing overloads: Foo.FooOverload, Foo.FooOverload(name: String), Foo.FooOverload(name: String, level: Number).");
}
