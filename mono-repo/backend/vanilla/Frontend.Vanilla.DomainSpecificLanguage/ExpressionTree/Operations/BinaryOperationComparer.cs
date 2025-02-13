using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>
/// Compares operands of <see cref="BinaryOperation" /> in a way either depending on their order or not.
/// </summary>
internal static class BinaryOperationOperandComparers
{
    public static readonly IEqualityComparer<BinaryOperation> SignificantOperandOrder = new LambdaEqualityComparer<BinaryOperation>(
        equalsFunc: (x, y) => x?.LeftOperand.Equals(y?.LeftOperand) is true
                              && x.RightOperand.Equals(y.RightOperand),
        hashCodeFunc: o => HashCode.Combine(o.LeftOperand, o.RightOperand));

    public static readonly IEqualityComparer<BinaryOperation> InsignificantOperandOrder = new InsignificantOperandOrderComparer();

    private sealed class InsignificantOperandOrderComparer : IEqualityComparer<BinaryOperation>
    {
        public bool Equals(BinaryOperation? first, BinaryOperation? second)
        {
            var firstOperands = FlattenOperands(first!);
            var secondOperands = FlattenOperands(second!);

            return firstOperands.ToHashSet().SetEquals(secondOperands);
        }

        public int GetHashCode(BinaryOperation operation)
        {
            var operands = FlattenOperands(operation);

            return HashCode.CombineIgnoreOrder(operands);
        }

        /// <summary>Goes deeper: "xx * (yy * zz)" equals "zz * (xx * yy)".</summary>
        private IEnumerable<IExpressionTree> FlattenOperands(BinaryOperation operation)
            => new[] { operation.LeftOperand, operation.RightOperand }
                .SelectMany(o => FlattenOperands(o, operation.Operator));

        private IEnumerable<IExpressionTree> FlattenOperands(IExpressionTree expression, IBinaryOperator parentOperator)
            => expression is BinaryOperation operation && operation.Operator == parentOperator
                ? FlattenOperands(operation)
                : new[] { expression };
    }
}
