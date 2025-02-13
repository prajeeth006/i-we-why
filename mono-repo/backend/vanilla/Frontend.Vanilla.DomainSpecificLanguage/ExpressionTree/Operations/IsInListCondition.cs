using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>
/// Condition which check if left operand is container in the list on the right.
/// </summary>
internal sealed class IsInListCondition : ExpressionTreeBase<IsInListCondition>
{
    public override DslType ResultType => DslType.Boolean;
    public IExpressionTree Operand { get; }
    public IReadOnlyList<IExpressionTree> List { get; }

    public IsInListCondition(IExpressionTree? operand, IEnumerable<IExpressionTree>? list)
    {
        var listEnumerated = list?.Enumerate();

        if (operand == null)
            throw new DslArgumentException("Missing operand on the left for is-in-list condition.");
        if (listEnumerated.IsNullOrEmpty())
            throw new DslArgumentException("List of values on the right for is-in-list condition can't be missing nor empty.");

        for (var i = 0; i < listEnumerated.Count; i++)
            if (listEnumerated[i]?.ResultType != operand.ResultType)
                throw new DslArgumentException(
                    "Values in the list on the right for is-in-list condition must be of same type as operand on the left"
                    + $" but operand is {operand.ResultType} and {i + 1}. value is {listEnumerated[i]?.ResultType}.");

        Operand = operand;
        List = listEnumerated.Distinct().OrderBy(i => i is Literal ? 0 : 1).ToArray(); // Literals first b/c cheap to evaluate
    }

    public override IEnumerable<IExpressionTree> GetChildren()
        => List.Append(Operand);

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        var operandEvaluated = await Operand.EvaluateAsync(context);
        var operandLiteral = operandEvaluated as Literal;
        var remainingList = new List<IExpressionTree>(List.Count);

        foreach (var item in List)
        {
            var itemEvaluated = await item.EvaluateAsync(context);
            var itemLiteral = itemEvaluated as Literal;

            if (operandLiteral == null || itemLiteral == null)
                remainingList.Add(itemEvaluated);
            else if (operandLiteral.Equals(itemLiteral))
                return BooleanLiteral.True; // Operand found in the list -> return true and no need to evaluate rest of it
        }

        // If nothing remains in the list be evaluated and operand wasn't found -> return false
        if (remainingList.Count == 0)
            return BooleanLiteral.False;

        return new IsInListCondition(operandEvaluated, remainingList);
    }

    public override string SerializeToClient()
    {
        var list = List.Select(i => i.SerializeToClient()).Join();
        var operand = Operand.SerializeToClient();

        return $"[{list}].includes({operand})";
    }

    public override bool Equals(IsInListCondition? other)
        => other?.Operand.Equals(Operand) is true
           && other.List.Count == List.Count
           && other.List.ToHashSet().SetEquals(List);

    public override int GetHashCode()
        => HashCode.Combine(Operand, HashCode.CombineIgnoreOrder(List));

    public override string ToString()
    {
        var listStr = List.Select(i => i.ToString()).Join();

        return $"({Operand} {Keyword.In.Value} {Keyword.LeftSquareBracket.Value}{listStr}{Keyword.RightSquareBracket.Value})";
    }
}
