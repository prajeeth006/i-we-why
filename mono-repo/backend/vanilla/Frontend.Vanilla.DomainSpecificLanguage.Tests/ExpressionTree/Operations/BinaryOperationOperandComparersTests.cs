using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public sealed class BinaryOperationOperandComparersTests
{
    private IExpressionTree left;
    private IExpressionTree leftEqual;
    private IExpressionTree right;
    private IExpressionTree rightEqual;
    private IBinaryOperator @operator;

    public BinaryOperationOperandComparersTests()
    {
        (left, leftEqual) = TestExpressionTree.GetEqual();
        (right, rightEqual) = TestExpressionTree.GetEqual();
        @operator = Mock.Of<IBinaryOperator>();
    }

    private void RunTest(bool significantOrderComparer, bool expectedEqual)
    {
        var first = new BinaryOperation(@operator, left, right);
        var second = new BinaryOperation(@operator, leftEqual, rightEqual);
        var target = significantOrderComparer
            ? BinaryOperationOperandComparers.SignificantOperandOrder
            : BinaryOperationOperandComparers.InsignificantOperandOrder;

        // Act & assert
        target.Equals(first, second).Should().Be(expectedEqual);
        target.Equals(second, first).Should().Be(expectedEqual);

        if (expectedEqual)
            target.GetHashCode(first).Should().Be(target.GetHashCode(second));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldEqual_IfEqualOperands(bool significantOrderComparer)
        => RunTest(significantOrderComparer, expectedEqual: true);

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void SignificantOperandOrder_ShouldNotEqual_IfEqualOperandsButDifferentOrder_AccordingToComparer(
        bool significantOrderComparer, bool expectedEqual)
    {
        var temp = leftEqual;
        leftEqual = rightEqual;
        rightEqual = temp;

        RunTest(significantOrderComparer, expectedEqual);
    }

    [Flags]
    public enum DifferentOperand
    {
        /// <summary>
        /// Left
        /// </summary>
        Left = 1,

        /// <summary>
        /// Right
        /// </summary>
        Right = 2,
    }

    [Theory]
    [InlineData(false, DifferentOperand.Left)]
    [InlineData(true, DifferentOperand.Left)]
    [InlineData(false, DifferentOperand.Right)]
    [InlineData(true, DifferentOperand.Right)]
    [InlineData(false, DifferentOperand.Left | DifferentOperand.Right)]
    [InlineData(true, DifferentOperand.Left | DifferentOperand.Right)]
    public void SignificantOperandOrder_ShouldNotEqual_IfDifferentOperands(
        bool significantOrderComparer,
        DifferentOperand differentOperand)
    {
        if (differentOperand.HasFlag(DifferentOperand.Left))
            leftEqual = Mock.Of<IExpressionTree>();
        if (differentOperand.HasFlag(DifferentOperand.Right))
            rightEqual = Mock.Of<IExpressionTree>();

        RunTest(significantOrderComparer, expectedEqual: false);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void InsignificantOperandOrder_ShouldEqual_IfDeeperOperandsEqual_WithSameOperator(bool sameChildOperator)
    {
        var (x, xEqual) = TestExpressionTree.GetEqual();
        var (y, yEqual) = TestExpressionTree.GetEqual();
        var (z, zEqual) = TestExpressionTree.GetEqual();
        var childOperator = sameChildOperator
            ? @operator
            : Mock.Of<IBinaryOperator>(o => o.Comparer == Mock.Of<IEqualityComparer<BinaryOperation>>());

        left = x;
        leftEqual = new BinaryOperation(childOperator, zEqual, xEqual);
        right = new BinaryOperation(childOperator, y, z);
        rightEqual = yEqual;

        RunTest(significantOrderComparer: false, expectedEqual: sameChildOperator);
    }
}
