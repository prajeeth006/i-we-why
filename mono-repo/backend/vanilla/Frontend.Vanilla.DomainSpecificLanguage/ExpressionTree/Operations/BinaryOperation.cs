using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>
/// Logical or comparison operation with left and right operand joined by <see cref="IBinaryOperator" />.
/// </summary>
internal sealed class BinaryOperation(IBinaryOperator @operator, IExpressionTree leftOperand, IExpressionTree rightOperand)
    : ExpressionTreeBase<BinaryOperation>
{
    public override DslType ResultType => Operator.ResultType;
    public IBinaryOperator Operator { get; } = @operator;
    public IExpressionTree LeftOperand { get; } = leftOperand.GuardResultType(@operator.LeftOperandType, nameof(leftOperand));
    public IExpressionTree RightOperand { get; } = rightOperand.GuardResultType(@operator.RightOperandType, nameof(rightOperand));

    public override IEnumerable<IExpressionTree> GetChildren()
        => new[] { LeftOperand, RightOperand };

    public override Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
        => Operator.Evaluator.EvaluateAsync(this, context);

    public override string SerializeToClient()
    {
        var left = LeftOperand.SerializeToClient();
        var right = RightOperand.SerializeToClient();

        return $"({Operator.SerializeToClient(left, right)})";
    }

    public override string ToString()
        => BinaryOperationRule.ToString(this);

    public override bool Equals(BinaryOperation? other)
        => Operator == other?.Operator
           && Operator.Comparer.Equals(this, other);

    public override int GetHashCode()
        => HashCode.Combine(Operator, Operator.Comparer.GetHashCode(this));
}
