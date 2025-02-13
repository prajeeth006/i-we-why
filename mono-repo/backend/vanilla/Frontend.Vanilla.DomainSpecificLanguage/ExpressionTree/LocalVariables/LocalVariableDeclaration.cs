using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;

/// <summary>
/// At the beginning of the expression, declares all local variables and assigns default values.
/// </summary>
internal sealed class LocalVariableDeclaration : ExpressionTreeBase<LocalVariableDeclaration>
{
    public override DslType ResultType => DslType.Void;
    public IExpressionTree Inner { get; }
    public IReadOnlyDictionary<TrimmedRequiredString, Literal> LocalVariableDefaults { get; }

    public LocalVariableDeclaration(IExpressionTree inner, IEnumerable<KeyValuePair<TrimmedRequiredString, DslType>> localVariables)
    {
        Inner = inner;
        LocalVariableDefaults = localVariables.ToDictionary(v => v.Key, v => Literal.GetDefault(v.Value.GuardNotVoid(nameof(localVariables))));
    }

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        LocalVariableDefaults.Each(v => context.LocalVariables.Add(v.Key, v.Value));

        var evaluatedInner = await Inner.EvaluateAsync(context);

        var allLocalVariables = evaluatedInner.GetLocalVariableUsages();
        var variablesToKeep = allLocalVariables.Where(v => v.Value.IsAccessed).Select(v => KeyValue.Get(v.Key, v.Value.Type)).ToList();

        if (variablesToKeep.Count != allLocalVariables.Count)
            evaluatedInner = RemoveNotAccessedVariables(evaluatedInner, variablesToKeep);

        return variablesToKeep.Count > 0
            ? new LocalVariableDeclaration(evaluatedInner, variablesToKeep)
            : evaluatedInner;
    }

    private IExpressionTree RemoveNotAccessedVariables(IExpressionTree expression, IEnumerable<KeyValuePair<TrimmedRequiredString, DslType>> localVariables)
    {
        var context = new EvaluationContext(ExecutionMode.Sync, DslEvaluation.Optimization, trace: null);
        localVariables.Each(v => context.LocalVariables.Add(v.Key, Literal.GetDefault(v.Value)));

        return ExecutionMode.ExecuteSync(expression.EvaluateAsync(context));
    }

    public override IEnumerable<IExpressionTree> GetChildren()
        => new[] { Inner };

    public override string SerializeToClient()
    {
        var variables = LocalVariableDefaults.Select(v => $"{v.Key}={v.Value.SerializeToClient()}").Join(",");

        return $"var {variables};{Inner.SerializeToClient()}";
    }

    public override string ToString()
        => LocalVariableDefaults
            .Select(v => $"{v.Key} {Keyword.VariableAssignment.Value} {v.Value}")
            .Append(Inner.ToString())
            .Join(Environment.NewLine);

    public override bool Equals(LocalVariableDeclaration? other)
        => other?.Inner.Equals(Inner) is true; // Enough to compare inner b/c variables are calculated from it

    public override int GetHashCode()
        => Inner.GetHashCode();
}
