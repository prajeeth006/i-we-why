using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>
/// Logic common for all expression tree nodes.
/// </summary>
internal abstract class ExpressionTreeBase<TThis> : IExpressionTree, IEquatable<TThis>
{
    public IReadOnlyDictionary<TrimmedRequiredString, LocalVariableInfo> GetLocalVariableUsages()
    {
        var usages = new Dictionary<TrimmedRequiredString, LocalVariableInfo>();
        foreach (var expression in FlattenExpressions())
            if (expression is LocalVariableAssignment assignment)
                UpdateUsage(assignment.VariableName, assignment.ValueToSet.ResultType, isAssigned: true);
            else if (expression is LocalVariableAccess access)
                UpdateUsage(access.VariableName, access.ResultType, isAccessed: true);

        return usages;

        void UpdateUsage(TrimmedRequiredString name, DslType type, bool isAssigned = false, bool isAccessed = false)
        {
            var existing = usages.GetValue(name);
            usages[name] = new LocalVariableInfo(type, isAssigned || existing.IsAssigned, isAccessed || existing.IsAccessed);
        }
    }

    public DslExpressionMetadata CreateMetadata()
    {
        var members = FlattenExpressions().OfType<ProviderAccess>().Select(a => a.Member).ToList();
        var volatility = members.Any(m => m.Volatility == ValueVolatility.Client)
            ? ValueVolatility.Client
            : (members.Any(m => m.Volatility == ValueVolatility.Server)
                ? ValueVolatility.Server
                : ValueVolatility.Static);
        var clientSideOnly = members.Any(m => m.IsClientOnly);
        var alreadyEvaluated = this is Literal;

        return new DslExpressionMetadata(volatility, clientSideOnly, alreadyEvaluated);
    }

    public virtual IEnumerable<IExpressionTree> FlattenExpressions()
    {
        var toExamine = new LinkedList<IExpressionTree> { this };

        while (toExamine.Count > 0)
        {
            yield return toExamine.First!.Value;

            toExamine.Add(toExamine.First.Value.GetChildren());
            toExamine.RemoveFirst();
        }
    }

    public sealed override bool Equals(object? obj)
        => obj is TThis other && Equals(other);

    public abstract DslType ResultType { get; }
    public abstract Task<IExpressionTree> EvaluateAsync(EvaluationContext context);
    public abstract string SerializeToClient();
    public abstract IEnumerable<IExpressionTree> GetChildren();
    public abstract override string ToString();
    public abstract bool Equals(TThis? other);
    public abstract override int GetHashCode();
}
