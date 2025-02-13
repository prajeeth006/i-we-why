using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;

internal static class TestExpressionTree
{
    public static (IExpressionTree, IExpressionTree) GetEqual(DslType resultType = default)
    {
        var expr1 = new EqualityExpressionTree { ResultType = resultType };
        var expr2 = new EqualityExpressionTree { ResultType = resultType };

        expr1.EqualExpression = expr2;
        expr2.EqualExpression = expr1;

        return (expr1, expr2);
    }

    private class EqualityExpressionTree : IExpressionTree
    {
        public DslType ResultType { get; set; }
        public bool IsAlreadyEvaluatedForClient { get; set; }
        public IEnumerable<ProviderMember> GetUsedProviderMembers() => Array.Empty<ProviderMember>();
        public Task<IExpressionTree> EvaluateAsync(EvaluationContext context) => throw new NotImplementedException();
        public string SerializeToClient() => throw new NotImplementedException();
        public IReadOnlyDictionary<TrimmedRequiredString, LocalVariableInfo> GetLocalVariableUsages() => new Dictionary<TrimmedRequiredString, LocalVariableInfo>();
        public DslExpressionMetadata CreateMetadata() => new DslExpressionMetadata();
        public IEnumerable<IExpressionTree> GetChildren() => Array.Empty<IExpressionTree>();

        public IExpressionTree EqualExpression { get; set; }

        public override bool Equals(object obj)
            => ReferenceEquals(obj, EqualExpression);

        public override int GetHashCode() => 123;
    }
}
