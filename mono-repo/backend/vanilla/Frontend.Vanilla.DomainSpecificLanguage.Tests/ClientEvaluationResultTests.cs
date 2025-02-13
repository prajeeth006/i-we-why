using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests;

public sealed class ClientEvaluationResultTests
{
    public static IEnumerable TestValues => new object[] { 123, "Hello" }; // Value and refernce type

    [Theory, MemberValuesData(nameof(TestValues))]
    public void FromValue_ShouldCreateCorrectly<T>(T value)
    {
        var result = ClientEvaluationResult<T>.FromValue(value); // Act

        result.HasFinalValue.Should().BeTrue();
        result.Value.Should().Be(value);
        ((IClientEvaluationResult)result).Value.Should().Be(value);
        result.Invoking(r => r.ClientExpression).Should().Throw<InvalidOperationException>().WithMessage(
            $"There is no {nameof(result.ClientExpression)} to be evaluated on the client because final {nameof(result.Value)} is already available. Check {nameof(result.HasFinalValue)} before accessing this property.");
    }

    [Theory, MemberValuesData(nameof(TestValues))]
    public void FromClientExpression_ShouldCreateCorrectly<T>(T dummy)
    {
        var dummy2 = dummy; // just that IDE is happy

        // Act
        var result = ClientEvaluationResult<T>.FromClientExpression("client-expr");

        result.HasFinalValue.Should().BeFalse();
        result.ClientExpression.Should().Be("client-expr");
        VerifyThrowOnGet(() => result.Value);
        VerifyThrowOnGet(() => ((IClientEvaluationResult)result).Value);

        void VerifyThrowOnGet(Func<object> act)
            => act.Should().Throw<InvalidOperationException>()
                .Which.Message.Should().ContainAll(nameof(result.Value), nameof(result.ClientExpression), nameof(result.HasFinalValue));
    }

    public static IEnumerable<object[]> EqualityTestCases => new[]
    {
        new object[] { true, ClientEvaluationResult<int>.FromValue(111), ClientEvaluationResult<int>.FromValue(111) },
        new object[] { true, ClientEvaluationResult<string>.FromValue("BWIN"), ClientEvaluationResult<string>.FromValue("BWIN") },
        new object[] { true, ClientEvaluationResult<int>.FromClientExpression("JS"), ClientEvaluationResult<int>.FromClientExpression("JS") },
        new object[] { true, ClientEvaluationResult<string>.FromClientExpression("JS"), ClientEvaluationResult<string>.FromClientExpression("JS") },
        new object[] { false, ClientEvaluationResult<int>.FromValue(111), ClientEvaluationResult<int>.FromValue(222) },
        new object[] { false, ClientEvaluationResult<string>.FromValue("BWIN"), ClientEvaluationResult<string>.FromValue("GVC") },
        new object[] { false, ClientEvaluationResult<int>.FromClientExpression("JS1"), ClientEvaluationResult<int>.FromClientExpression("JS2") },
        new object[] { false, ClientEvaluationResult<string>.FromClientExpression("JS1"), ClientEvaluationResult<string>.FromClientExpression("JS2") },
        new object[] { false, ClientEvaluationResult<int>.FromValue(111), null },
    };

    [Theory, MemberData(nameof(EqualityTestCases))]
    public void ShouldEqualCorrectly<T>(bool expected, ClientEvaluationResult<T> first, ClientEvaluationResult<T> second)
        => EqualityTest.Run(expected, first, second);

    [Fact]
    public void ShouldNotEqualToOtherValues()
        => EqualityTest.RunWithOtherValues(ClientEvaluationResult<string>.FromValue("whatever"));

    [Fact]
    public void ShouldNotEqualToDifferentType()
    {
        object first = ClientEvaluationResult<string>.FromValue("BWIN");
        object second = ClientEvaluationResult<object>.FromValue("BWIN");
        first.Equals(second).Should().BeFalse();
    }
}
