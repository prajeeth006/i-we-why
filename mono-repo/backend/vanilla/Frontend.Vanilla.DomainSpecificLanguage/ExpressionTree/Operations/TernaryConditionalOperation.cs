using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>
/// Ternary condition operator which returns either consequent or alternative expression based on the condition result.
/// </summary>
internal sealed class TernaryConditionalOperation(IExpressionTree condition, IExpressionTree consequent, IExpressionTree alternative)
    : ExpressionTreeBase<TernaryConditionalOperation>
{
    public override DslType ResultType => Consequent.ResultType;
    public IExpressionTree Condition { get; } = condition.GuardResultType(DslType.Boolean, nameof(condition));
    public IExpressionTree Consequent { get; } = consequent.GuardResultType(SupportedTypes, nameof(consequent));
    public IExpressionTree Alternative { get; } = alternative.GuardResultType(consequent.ResultType, nameof(alternative));

    public static readonly IReadOnlyList<DslType> SupportedTypes = new[] { DslType.String, DslType.Number };

    public override IEnumerable<IExpressionTree> GetChildren()
        => new[] { Condition, Consequent, Alternative };

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        var conditionEvaluated = await Condition.EvaluateAsync(context);

        if (!(conditionEvaluated is BooleanLiteral conditionLiteral))
        {
            var consequentEvaluatedTask = Consequent.EvaluateAsync(context);
            var alternativeEvaluated = await Alternative.EvaluateAsync(context);
            var consequentEvaluated = await consequentEvaluatedTask; // Run in parallel

            return new TernaryConditionalOperation(conditionEvaluated, consequentEvaluated, alternativeEvaluated);
        }

        var operandToEvaluate = conditionLiteral.Value ? Consequent : Alternative;

        return await operandToEvaluate.EvaluateAsync(context);
    }

    public override string SerializeToClient()
        => $"({Condition.SerializeToClient()}?{Consequent.SerializeToClient()}:{Alternative.SerializeToClient()})";

    public override string ToString()
        => TernaryConditionalOperationRule.ToString(this);

    public override bool Equals(TernaryConditionalOperation? other)
        => other?.Condition.Equals(Condition) is true
           && other.Consequent.Equals(Consequent)
           && other.Alternative.Equals(Alternative);

    public override int GetHashCode()
        => HashCode.Combine(Condition, Consequent, Alternative);
}
