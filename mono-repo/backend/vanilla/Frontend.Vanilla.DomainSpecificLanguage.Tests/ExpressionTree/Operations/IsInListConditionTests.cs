using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public sealed class IsInListConditionTests
{
    private Mock<IExpressionTree> operand;
    private Mock<IExpressionTree> item1;
    private Mock<IExpressionTree> item2;
    private List<IExpressionTree> list;
    private EvaluationContext ctx;

    public IsInListConditionTests()
    {
        operand = new Mock<IExpressionTree>();
        item1 = new Mock<IExpressionTree>();
        item2 = new Mock<IExpressionTree>();
        list = new List<IExpressionTree> { item1.Object, item2.Object, item1.Object }; // Duplicate should be removed
        ctx = TestEvaluationContext.Get();
    }

    private IsInListCondition GetTarget()
        => new IsInListCondition(operand?.Object, list);

    private void SetupType(DslType type)
    {
        operand.SetupGet(o => o.ResultType).Returns(type);
        item1.SetupGet(i => i.ResultType).Returns(type);
        item2.SetupGet(i => i.ResultType).Returns(type);
    }

    [Theory]
    [InlineData(DslType.Boolean)]
    [InlineData(DslType.Number)]
    [InlineData(DslType.String)]
    [InlineData(DslType.Void)]
    internal void Constructor_ShouldCreate(DslType type)
    {
        SetupType(type);

        var target = GetTarget(); // Act

        target.Operand.Should().BeSameAs(operand.Object);
        target.List.Should().Equal(item1.Object, item2.Object);
        target.ResultType.Should().Be(DslType.Boolean);
    }

    [Fact]
    public void Constructor_ShouldPutLiteralsFirst_BecauseCheapToEvaluate()
    {
        var wtfLiteral = StringLiteral.Get("wtf");
        var omgLiteral = StringLiteral.Get("omg");
        list.Insert(1, wtfLiteral);
        list.Add(omgLiteral, wtfLiteral); // Duplicate should be removed

        var target = GetTarget(); // Act

        target.List.Should().Equal(wtfLiteral, omgLiteral, item1.Object, item2.Object);
    }

    [Fact]
    public void Constructor_ShouldThrow_IfNullOperand()
    {
        operand = null;
        RunConstructorAndExpectError("Missing operand on the left for is-in-list condition.");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Constructor_ShouldThrow_IfNullOrEmptyList(bool nullList)
    {
        list = nullList ? null : new List<IExpressionTree>();
        RunConstructorAndExpectError("List of values on the right for is-in-list condition can't be missing nor empty.");
    }

    [Fact]
    public void Constructor_ShouldThrow_IfListItemHasDifferentType()
    {
        item2.SetupGet(i => i.ResultType).Returns(DslType.Number);
        RunConstructorAndExpectError(
            $"Values in the list on the right for is-in-list condition must be of same type as operand on the left but operand is {DslType.String} and 2. value is {DslType.Number}.");
    }

    private void RunConstructorAndExpectError(string expectedError)
        => new Func<object>(GetTarget).Should().Throw().WithMessage(expectedError);

    public static IEnumerable<object[]> EvaluateTestValues => new[]
    {
        new object[] { StringLiteral.Get("bwin"), false },
        new object[] { NumberLiteral.Get(66), false },
        new object[] { BooleanLiteral.True, false },
        new object[] { BooleanLiteral.False, false },
        new object[] { StringLiteral.Get("bwin"), true },
        new object[] { NumberLiteral.Get(66), true },
        new object[] { BooleanLiteral.True, true },
        new object[] { BooleanLiteral.False, true },
    };

    [Theory, MemberData(nameof(EvaluateTestValues))]
    internal async Task EvaluateAsync_ShouldReturnTrue_IfAtLeastOneItemMatched(
        Literal literal,
        bool isItem1Evaluated)
    {
        var unevaluated = Mock.Of<IExpressionTree>(e => e.ResultType == literal.ResultType);
        operand.Setup(o => o.EvaluateAsync(ctx)).ReturnsAsync(literal);
        item1.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(isItem1Evaluated ? literal : unevaluated);
        item2.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(isItem1Evaluated ? unevaluated : literal);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(BooleanLiteral.True);
        item2.VerifyWithAnyArgs(i => i.EvaluateAsync(null), Times.Exactly(isItem1Evaluated ? 0 : 1));
    }

    public static IEnumerable<object[]> EvaluateToFalseTestCases => new[]
    {
        new object[] { StringLiteral.Get("a"), StringLiteral.Get("b"), StringLiteral.Get("c") },
        new object[] { NumberLiteral.Get(1), NumberLiteral.Get(2), NumberLiteral.Get(3) },
        new object[] { BooleanLiteral.True, BooleanLiteral.False, BooleanLiteral.False },
        new object[] { BooleanLiteral.False, BooleanLiteral.True, BooleanLiteral.True },
    };

    [Theory, MemberData(nameof(EvaluateToFalseTestCases))]
    internal async Task EvaluateAsync_ShouldEvaluateToFalse_IfNoneMatched(Literal operandEvaluated, Literal item1Evaluated, Literal item2Evaluated)
    {
        operand.Setup(o => o.EvaluateAsync(ctx)).ReturnsAsync(operandEvaluated);
        item1.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(item1Evaluated);
        item2.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(item2Evaluated);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(BooleanLiteral.False);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task EvaluateAsync_ShouldRecreate_IfNotMatchedYetAndNotAllItemsEvaluatedToLiteral(bool evalItem1ToLiteral)
    {
        var operandEvaluated = StringLiteral.Get("a");
        var unevaluated = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);

        operand.Setup(o => o.EvaluateAsync(ctx)).ReturnsAsync(operandEvaluated);
        item1.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(evalItem1ToLiteral ? StringLiteral.Get("b") : unevaluated);
        item2.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(evalItem1ToLiteral ? unevaluated : StringLiteral.Get("b"));

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<IsInListCondition>(c => c.Operand == operandEvaluated && c.List.SequenceEqual(unevaluated));
    }

    public static IEnumerable<object[]> OperandNotEvaluatedTestCases => new[]
    {
        new object[] { NumberLiteral.Get(111m), NumberLiteral.Get(2.22m), DslType.Number },
        new object[] { StringLiteral.Get("a"), StringLiteral.Get("b"), DslType.String },
        new object[] { BooleanLiteral.True, BooleanLiteral.False, DslType.Boolean },
    };

    [Theory, MemberData(nameof(OperandNotEvaluatedTestCases))]
    internal async Task EvaluateAsync_ShouldRecreate_IfOperandNotEvaluatedToLiteral(Literal item1Evaluated, Literal item2Evaluated, DslType dslType)
    {
        var operandEvaluated = Mock.Of<IExpressionTree>(e => e.ResultType == dslType);
        operand.Setup(o => o.EvaluateAsync(ctx)).ReturnsAsync(operandEvaluated);
        item1.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(item1Evaluated);
        item2.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(item2Evaluated);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<IsInListCondition>(c => c.Operand == operandEvaluated && c.List.SequenceEqual(item1Evaluated, item2Evaluated));
    }

    [Theory]
    [InlineData(1, "[xxx].includes(ooo)")]
    [InlineData(2, "[xxx, yyy].includes(ooo)")]
    public void SerializeToClient_ShouldReturnClientExpression(int listCount, string expected)
    {
        operand.Setup(o => o.SerializeToClient()).Returns("ooo");
        item1.Setup(o => o.SerializeToClient()).Returns("xxx");
        item2.Setup(o => o.SerializeToClient()).Returns("yyy");
        var target = new IsInListCondition(operand.Object, list.Take(listCount));

        // Act
        target.SerializeToClient().Should().Be(expected);
    }

    [Fact]
    public void GetChildren_ShouldReturnOperandAndItems()
        => GetTarget().GetChildren().Should().BeEquivalentTo(operand.Object, item1.Object, item2.Object);

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var (operand, equalOperand) = TestExpressionTree.GetEqual();
        var (param1, equalParam1) = TestExpressionTree.GetEqual();
        var (param2, equalParam2) = TestExpressionTree.GetEqual();
        var target = new IsInListCondition(operand, new[] { param1, param2 });

        return new[]
        {
            new object[] { true, target, new IsInListCondition(equalOperand, new[] { equalParam1, equalParam2 }) },
            new object[] { true, target, new IsInListCondition(equalOperand, new[] { equalParam2, equalParam1 }) }, // Order should not matter
            new object[] { false, target, new IsInListCondition(equalOperand, new[] { equalParam1 }) }, // List subset
            new object[] { false, target, new IsInListCondition(equalOperand, new[] { equalParam1, equalParam2, Mock.Of<IExpressionTree>() }) }, // List superset
            new object[] { false, target, new IsInListCondition(Mock.Of<IExpressionTree>(), new[] { equalParam1, equalParam2 }) }, // Different operand
            new object[] { false, target, new IsInListCondition(equalOperand, new[] { Mock.Of<IExpressionTree>(), equalParam2 }) }, // Different item in the list
            new object[] { false, target, new IsInListCondition(Mock.Of<IExpressionTree>(), new[] { Mock.Of<IExpressionTree>() }) }, // Completely different
        };
    }

    [Theory, MemberData(nameof(GetEqualityTestCases))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, IsInListCondition arg1, IsInListCondition arg2)
        => EqualityTest.Run(expected, arg1, arg2);

    [Fact]
    public void ToString_ShouldRecreateOriginalExpression()
    {
        operand.Setup(o => o.ToString()).Returns("op");
        item1.Setup(i => i.ToString()).Returns("it1");
        item2.Setup(i => i.ToString()).Returns("it2");

        GetTarget().ToString().Should().Be("(op IN [it1, it2])");
    }
}
