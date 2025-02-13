using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using HashCode = Frontend.Vanilla.Core.System.HashCode;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>
/// Retrieves provider member to be used in expression.
/// </summary>
internal sealed class ProviderAccess : ExpressionTreeBase<ProviderAccess>
{
    public override DslType ResultType => Member.DslType;
    public ProviderMember Member { get; }
    public IReadOnlyList<IExpressionTree> Parameters { get; }

    public ProviderAccess(ProviderMember member, IEnumerable<IExpressionTree>? parameters = null)
    {
        Member = member;
        Parameters = Guard.NotNull(parameters.NullToEmpty().ToArray(), nameof(parameters));

        if (Parameters.Count != 0 && Member.Parameters.Count == 0)
            throw new DslArgumentException(
                $"DSL provider member '{Member.ProviderName}.{Member.MemberName}' can't be called with any parameter"
                + $" because it's a property but there are {Parameters.Count} parameters specified.");

        for (var i = 0; i < Member.Parameters.Count; i++)
            if (Parameters.Count != Member.Parameters.Count || Parameters[i].ResultType != Member.Parameters[i].Type)
                throw new DslArgumentException(
                    $"DSL provider function '{Member.ProviderName}.{Member.MemberName}' must be called with parameters"
                    + $" ({Member.Parameters.Join()}) but these are specified: ({Parameters.Select(p => p.ResultType).Join()}).");
    }

    public override IEnumerable<IExpressionTree> GetChildren()
        => Parameters;

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        var paramValues = Array.Empty<object>();

        try
        {
            var paramsEvaluated = await Task.WhenAll(Parameters.Select(p => p.EvaluateAsync(context)));
            paramValues = paramsEvaluated.OfType<Literal>().Select(l => l.GetValue<object>()).ToArray();

            var deferEvaluation = paramValues.Length != paramsEvaluated.Length
                                  || (context.Evaluation == DslEvaluation.PartialForClient && Member.Volatility == ValueVolatility.Client)
                                  || (context.Evaluation == DslEvaluation.Optimization && Member.Volatility != ValueVolatility.Static);

            if (deferEvaluation)
                return Parameters.Count > 0 ? new ProviderAccess(Member, paramsEvaluated) : this;

            if (Member.IsClientOnly)
                throw new Exception(
                    "Attempt to get value of ClientSideOnly provider member on the server. Only DslEvaluation.PartialForClient is supported for such provider members.");

            // Actual access
            var value = await Member.ValueAccessor(context.Mode, paramValues);

            if (Member.DslType == DslType.Void)
                context.Trace?.Record("DSL action executed: {providerName}.{memberName}({parameters})",
                    ("providerName", Member.ProviderName.Value),
                    ("memberName", Member.MemberName.Value),
                    ("parameters", paramValues),
                    ("executionMode", context.Mode.ToString()));

            return value switch
            {
                null when ResultType == DslType.String => StringLiteral.Empty,
                null => throw new Exception($"Provider returned unexpected null for type {ResultType}."),
                _ => Literal.GetWildcard(value),
            };
        }
        catch (Exception ex)
        {
            var argsStr = Member.Parameters.Count > 0 ? $" with arguments: {(paramValues.Length > 0 ? paramValues.Dump() : "(not evaluated yet)")}" : "";
            var message = $"Failed runtime evaluation of DSL provider member {Member}{argsStr}.";

            throw new Exception(message, ex);
        }
    }

    public const string ContextVariableName = "c";

    public override string SerializeToClient()
    {
        var args = Parameters.Count > 0 || ResultType == DslType.Void ? $"({Parameters.Select(p => p.SerializeToClient()).Join(",")})" : "";
        var suffix = ResultType == DslType.Void ? ";" : "";

        return $"{ContextVariableName}.{Member.ProviderName}.{Member.MemberName}{args}{suffix}";
    }

    public override string ToString()
    {
        var args = Parameters.Count > 0 ? $"({Parameters.Select(p => p.ToString()).Join()})" : null;

        return $"{Member.ProviderName}.{Member.MemberName}{args}";
    }

    public override bool Equals(ProviderAccess? other)
        => other?.Member.Equals(Member) is true
           && other.Parameters.SequenceEqual(Parameters);

    public override int GetHashCode()
        => HashCode.Combine(Member, HashCode.Combine(Parameters));
}
