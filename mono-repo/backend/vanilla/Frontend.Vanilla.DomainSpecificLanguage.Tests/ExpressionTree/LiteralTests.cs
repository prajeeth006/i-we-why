#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public sealed class LiteralTests
{
    [Fact]
    internal void Constants_ShouldHaveCorrectValue()
    {
        BooleanLiteral.True.Value.Should().Be(true);
        BooleanLiteral.False.Value.Should().Be(false);
        StringLiteral.Empty.Value.Should().Be("");
        NumberLiteral.Zero.Value.Should().Be(0m);
        VoidLiteral.Singleton.Value.Should().Be(VoidDslResult.Singleton);
    }

    public static IEnumerable<object[]> WildcardValues => new[]
    {
        new object[] { Literal.GetWildcard(true), true },
        new object[] { Literal.GetWildcard(false), false },
        new object[] { Literal.GetWildcard("bwin"), "bwin" },
        new object[] { Literal.GetWildcard(VoidDslResult.Singleton), VoidDslResult.Singleton },
    };

    [Theory, MemberData(nameof(WildcardValues))]
    internal void GetWildcard_ShouldReturnProperInstance<T>(Literal target, T value)
        where T : notnull, IEquatable<T>
    {
        // Act
        target.GetValue<T>().Should().Be(value);
    }

    [Fact]
    public void GetWildcard_ShouldReturnProperInstance2()
    {
        Literal.GetWildcard(666m).GetValue<decimal>().Should().Be(666m);
    }

    [Fact]
    public void GetWildcard_ShouldThrow_IfUnsupportedValueType()
    {
        Action act = () => Literal.GetWildcard(666);

        act.Should().Throw<ArgumentException>()
            .WithMessage(
                $"Unsupported value 666 of type System.Int32. Supported: System.String, System.Decimal, System.Boolean, {typeof(VoidDslResult)}. (Parameter 'value')")
            .And.ParamName.Should().Be("value");
    }

    [Fact]
    public void GetWildcard_ShouldThrow_IfNullValue()
        => new Action(() => Literal.GetWildcard(null!))
            .Should().Throw<ArgumentNullException>().And.ParamName.Should().Be("value");

    public static IEnumerable<object[]> GetDefaultTestCases => new[]
    {
        new object[] { DslType.Boolean, BooleanLiteral.False },
        new object[] { DslType.String, StringLiteral.Empty },
        new object[] { DslType.Number, NumberLiteral.Zero },
        new object[] { DslType.Void, VoidLiteral.Singleton },
    };

    [Theory, MemberData(nameof(GetDefaultTestCases))]
    internal void GetDefault_ShouldReturnProperInstance(DslType type, Literal expected)
        => Literal.GetDefault(type).Should().BeSameAs(expected);

    [Theory, MemberData(nameof(GetDefaultTestCases))]
    internal void GetDslType_ShouldGetDslTypeOfLiteral<T>(DslType expected, T dummy)
        where T : Literal
    {
        var dummy2 = dummy;
        Literal.GetDslType<T>().Should().Be(expected);
    }

    public static IEnumerable<object[]> ValueTestCases => new[]
    {
        new object[] { BooleanLiteral.True, true },
        new object[] { BooleanLiteral.False, false },
        // new object[] { NumberLiteral.Get(66.6m), 66.6m },
        new object[] { StringLiteral.Get("wtf"), "wtf" },
        new object[] { VoidLiteral.Singleton, VoidDslResult.Singleton },
    };

    [Theory, MemberData(nameof(ValueTestCases))]
    internal void Value_ShouldExposeUnderlyingValue<T>(Literal target, T expected)
        where T : notnull, IEquatable<T>
        => target.GetValue<T>().Should().Be(expected);

    [Theory, MemberData(nameof(GetDefaultTestCases))]
    internal void ResultType_ShouldAccordingToType(DslType expected, Literal target)
        => target.ResultType.Should().Be(expected);

    [Theory, BooleanData]
    public void Get_ShouldGetSameObject_IfBoolean_ToOptimizePerformance(bool value)
        => ((BooleanLiteral)value).Should().BeSameAs((BooleanLiteral)value);

    [Theory, MemberData(nameof(ValueTestCases))]
    internal void GetValue_ShouldGetUnderlyingValue<T>(Literal target, T expected)
        where T : notnull, IEquatable<T>
        => target.GetValue<T>().Should().Be(expected);

    [Theory, MemberData(nameof(ValueTestCases))]
    internal void GetValue_ShouldGetUnderlyingValue_UpcastingIt(Literal target, object expected)
        => target.GetValue<object>().Should().Be(expected);

    [Fact]
    public void GetChildren_ShouldBeEmpty()
    {
        var target = Mock.Of<Literal>();

        // Act
        target.GetChildren().Should().BeEmpty();
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnSameLiteral()
    {
        var target = Mock.Of<Literal>();
        var ctx = TestEvaluationContext.Get();

        // Act
        var task = target.EvaluateAsync(ctx);

        (await task).Should().BeSameAs(target);
        task.Should().BeSameAs(target.EvaluateAsync(ctx), "should be cached to optimize performance");
    }

    public static IEnumerable<object[]> SerializeToClientTestCases => new[]
    {
        new object[] { NumberLiteral.Get(666), "666" },
        new object[] { NumberLiteral.Get(6.66m), "6.66" },
        new object[] { BooleanLiteral.True, "true" },
        new object[] { BooleanLiteral.False, "false" },
        new object[] { StringLiteral.Get(""), "''" },
        new object[] { StringLiteral.Get("bwin"), "'bwin'" },
        new object[] { StringLiteral.Get("need'escaping"), @"'need\'escaping'" },
        new object[] { VoidLiteral.Singleton, "" },
    };

    [Theory, MemberData(nameof(SerializeToClientTestCases))]
    internal void SerializeToClient_ShouldReturnClientExpression(Literal target, string expected)
        => target.SerializeToClient().Should().Be(expected);

    public static IEnumerable<object[]> BooleanLiterals => new[]
    {
        new object[] { BooleanLiteral.True },
        new object[] { BooleanLiteral.False },
    };

    [Theory, MemberData(nameof(BooleanLiterals))]
    internal void SerializeToClient_ShouldGetSameObject_IfBoolean_ToOptimizePerformance(BooleanLiteral target)
        => target.SerializeToClient().Should().BeSameAs(target.SerializeToClient());

    public static IEnumerable<object[]> EqualityTestCases => new[]
    {
        new object[] { true, BooleanLiteral.True, BooleanLiteral.True },
        new object[] { true, BooleanLiteral.False, BooleanLiteral.False },
        new object[] { false, BooleanLiteral.False, BooleanLiteral.True },
        new object[] { false, BooleanLiteral.True, BooleanLiteral.False },
        new object[] { true, NumberLiteral.Get(111), NumberLiteral.Get(111) },
        new object[] { false, NumberLiteral.Get(111), NumberLiteral.Get(222) },
        new object[] { true, StringLiteral.Get("Chuck Norris"), StringLiteral.Get("Chuck Norris") },
        new object[] { false, StringLiteral.Get("Chuck Norris"), StringLiteral.Get("Bruce Lee") },
        new object[] { true, VoidLiteral.Singleton, VoidLiteral.Singleton },
        new object[] { false, BooleanLiteral.True, NumberLiteral.Get(123) },
        new object[] { false, NumberLiteral.Get(123), StringLiteral.Get("abc") },
        new object[] { false, StringLiteral.Get("abc"), BooleanLiteral.False },
    };

    [Theory, MemberData(nameof(EqualityTestCases))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, Literal first, Literal second)
        => EqualityTest.Run(expected, first, second);

    public static IEnumerable<object[]> ToStringTestCases => new[]
    {
        new object[] { NumberLiteral.Get(666), "666" },
        new object[] { NumberLiteral.Get(6.66m), "6.66" },
        new object[] { BooleanLiteral.True, "TRUE" },
        new object[] { BooleanLiteral.False, "FALSE" },
        new object[] { StringLiteral.Get(@"bw""in"), @"'bw""in'" },
        new object[] { StringLiteral.Get(@"bw'in"), @"""bw'in""" },
        new object[] { VoidLiteral.Singleton, "(void literal, DSL action fully executed)" },
    };

    [Theory, MemberData(nameof(ToStringTestCases))]
    internal void ToString_ShouldRecreateOriginalExpression(Literal target, string expected)
        => target.ToString().Should().Be(expected);

    [Fact]
    public async Task VoidLiteral_SingletonTask_ShouldAwaitToSingleton()
        => (await VoidLiteral.SingletonTask).Should().BeSameAs(VoidLiteral.Singleton);
}
