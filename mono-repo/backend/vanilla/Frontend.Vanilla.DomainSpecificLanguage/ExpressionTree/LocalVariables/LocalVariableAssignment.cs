using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;

/// <summary>
/// Evaluates value and then sets it to local variable with particular name.
/// </summary>
internal sealed class LocalVariableAssignment : ExpressionTreeBase<LocalVariableAssignment>
{
    public override DslType ResultType => DslType.Void;
    public TrimmedRequiredString VariableName { get; }
    public IExpressionTree ValueToSet { get; }

    public LocalVariableAssignment(TrimmedRequiredString variableName, IExpressionTree valueToSet)
    {
        valueToSet.ResultType.GuardNotVoid(nameof(valueToSet));
        VariableName = variableName;
        ValueToSet = valueToSet;
    }

    public override Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
        => context.LocalVariables.ContainsKey(VariableName)
            ? EvaluateVariableAsync(context)
            : VoidLiteral.SingletonTask; // Variable wasn't declared b/c not accessed -> don't assign but skip

    private async Task<IExpressionTree> EvaluateVariableAsync(EvaluationContext context)
    {
        var evaluatedValue = await ValueToSet.EvaluateAsync(context);

        var literal = evaluatedValue as Literal;
        context.LocalVariables[VariableName] = literal;

        if (context.Evaluation == DslEvaluation.FullOnServer)
        {
            Guard.Assert(literal != null);

            return VoidLiteral.Singleton;
        }

        return new LocalVariableAssignment(VariableName, evaluatedValue);
    }

    public override IEnumerable<IExpressionTree> GetChildren()
        => new[] { ValueToSet };

    public override string SerializeToClient()
        => $"{VariableName}={ValueToSet.SerializeToClient()};";

    public override string ToString()
        => LocalVariableAssignmentRule.ToString(this);

    public override bool Equals(LocalVariableAssignment? other)
        => other?.VariableName.Equals(VariableName) is true
           && other.ValueToSet.Equals(ValueToSet);

    public override int GetHashCode()
        => HashCode.Combine(VariableName, ValueToSet);
}
