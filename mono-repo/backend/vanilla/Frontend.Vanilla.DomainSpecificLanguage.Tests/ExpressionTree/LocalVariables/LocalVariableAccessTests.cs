using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.LocalVariables;

public class LocalVariableAccessTests
{
    private EvaluationContext ctx;

    public LocalVariableAccessTests()
        => ctx = TestEvaluationContext.Get();

    private LocalVariableAccess GetTarget(DslType type = DslType.String)
        => new LocalVariableAccess(type, "foo");

    public static IEnumerable<object[]> DslTypesCases => DslTypeHelper.ResultTypes.Select(r => new object[] { r });

    [Theory]
    [MemberData(nameof(DslTypesCases))]
    internal void Constructor_ShouldCreateCorrectly(DslType type)
    {
        // Act
        var target = GetTarget(type);

        target.VariableName.Should().Be("foo");
        target.ResultType.Should().Be(type);
    }

    [Fact]
    public void Constructor_ShouldThrow_IfVoidType()
        => new Action(() => GetTarget(DslType.Void))
            .Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be("resultType");

    [Fact]
    public async Task EvaluateAsync_ShouldReturnVariable_IfFinalVariable()
    {
        var finalVar = StringLiteral.Get("bwin");
        ctx.LocalVariables["foo"] = finalVar;

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(finalVar);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnThis_IfVariableNotFinal()
    {
        ctx.LocalVariables["foo"] = null;
        var target = GetTarget();

        // Act
        var result = await target.EvaluateAsync(ctx);

        result.Should().BeSameAs(target);
    }

    [Fact]
    public void SerializeToClient_ShouldReturnVariableName()
        => GetTarget().SerializeToClient().Should().Be("foo");

    [Fact]
    public void GetChildren_ShouldReturnEmpty()
        => GetTarget().GetChildren().Should().BeEmpty();

    [Fact]
    public void ToString_ShouldReturnVariableName()
        => GetTarget().ToString().Should().Be("foo");

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var target = new LocalVariableAccess(DslType.String, "foo");

        return new[]
        {
            new object[] { true, target, new LocalVariableAccess(DslType.String, "foo") },
            new object[] { true, target, new LocalVariableAccess(DslType.Number, "foo") },
            new object[] { false, target, new LocalVariableAccess(DslType.String, "bar") },
        };
    }

    [Theory, MemberData(nameof(GetEqualityTestCases))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, LocalVariableAccess arg1, LocalVariableAccess arg2)
        => EqualityTest.Run(expected, arg1, arg2);
}
