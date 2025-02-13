using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>
/// Logical or string operation on a single operand defined by <see cref="IUnaryOperator" />.
/// </summary>
internal sealed class UnaryOperation(IUnaryOperator @operator, IExpressionTree? operand) : ExpressionTreeBase<UnaryOperation>
{
    public override DslType ResultType => Operator.ResultType;
    public IUnaryOperator Operator { get; } = @operator;
    public IExpressionTree Operand { get; } = operand?.ResultType == @operator.SupportedOperandType
        ? operand
        : throw new DslArgumentException($"{@operator} requires {@operator.SupportedOperandType} expression as its operand"
                                         + $" but there is {(operand != null ? $"a {operand.ResultType} operand" : "nothing")}.");

    public override IEnumerable<IExpressionTree> GetChildren()
        => new[] { Operand };

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        var operandEvaluated = await Operand.EvaluateAsync(context);

        if (!(operandEvaluated is Literal literal))
            return new UnaryOperation(Operator, operandEvaluated);

        return Operator.Evaluate(literal);
    }

    public override string SerializeToClient()
        => Operator.SerializeToClient(Operand.SerializeToClient());

    public override string ToString()
        => UnaryOperationRule.ToString(this);

    public override bool Equals(UnaryOperation? other)
        => other?.Operator == Operator
           && other.Operand.Equals(Operand);

    public override int GetHashCode()
        => HashCode.Combine(Operator, Operand);
}
