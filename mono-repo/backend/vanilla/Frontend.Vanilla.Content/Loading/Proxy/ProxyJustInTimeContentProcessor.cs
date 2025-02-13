using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Content.Loading.Proxy;

/// <summary>
/// If content item is proxy, redirects result to target according to its DSL rules.
/// As far as DSL expressions are user specific, result can't be cached.
/// See <see cref="ProxyPreCachingContentProcessor" /> which must be executed before.
/// </summary>
internal sealed class ProxyJustInTimeContentProcessor(IEnumerable<CompiledProxyRule> proxyRules) : IJustInTimeContentProcessor
{
    public IReadOnlyList<CompiledProxyRule> ProxyRules { get; } = Guard.NotEmptyNorNullItems(proxyRules?.ToArray().AsReadOnly(), nameof(proxyRules));

    public async Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object> trace)
    {
        try
        {
            trace?.Invoke($"Evaluating {options.DslEvaluation} proxy with following rules.");
            trace?.Invoke(ProxyRules);

            switch (options.DslEvaluation)
            {
                case DslEvaluation.PartialForClient:
                    var clientRules = new List<ProxyRule>(ProxyRules.Count);

                    foreach (var rule in ProxyRules)
                    {
                        trace?.Invoke($"Evaluating rule with Condition {rule.Condition.Dump()}.");
                        var dslResult = rule.Condition != null ? await rule.Condition.EvaluateForClientAsync(mode) : null;

                        if (dslResult == null || (dslResult.HasFinalValue && dslResult.Value)) // If fully matched -> will always match on client too
                        {
                            if (clientRules.Count == 0)
                                return await LoadTargetContentAsync(rule); // No previous partially matched rules -> no proxy but return target content

                            trace?.Invoke(TraceMessages.RuleMatchedAsLastForClient);
                            clientRules.Add(new ProxyRule(null, rule.TargetId));

                            break;
                        }

                        if (!dslResult.HasFinalValue)
                        {
                            trace?.Invoke($"The rule evaluated to client expression '{dslResult.ClientExpression}'.");
                            clientRules.Add(new ProxyRule(dslResult.ClientExpression, rule.TargetId));
                        }
                        else
                        {
                            trace?.Invoke(TraceMessages.RuleNotMatched);
                        }
                    }

                    if (clientRules.Count == 0)
                    {
                        trace?.Invoke(TraceMessages.FilteredPartialForClient);

                        return content.ToFiltered();
                    }

                    trace?.Invoke(TraceMessages.ClientProxy);
                    trace?.Invoke(clientRules);

                    return content.WithFieldsOverwritten((nameof(IProxy.Target), clientRules.AsReadOnly()));

                case DslEvaluation.FullOnServer:
                    foreach (var rule in ProxyRules)
                    {
                        trace?.Invoke($"Evaluating rule with Condition {rule.Condition.Dump()}.");
                        var passed = rule.Condition == null || await rule.Condition.EvaluateAsync(mode);

                        if (passed)
                            return await LoadTargetContentAsync(rule);

                        trace?.Invoke(TraceMessages.RuleNotMatched);
                    }

                    trace?.Invoke(TraceMessages.FilteredFullOnServer);

                    return content.ToFiltered();

                default:
                    throw options.DslEvaluation.GetInvalidException();
            }
        }
        catch (DslEvaluationException ex)
        {
            trace?.Invoke(ErrorPrefix + ex);

            return content.ToInvalid(ErrorPrefix + ex);
        }

        Task<Content<IDocument>> LoadTargetContentAsync(CompiledProxyRule rule)
        {
            if (rule.TargetId == null)
            {
                trace?.Invoke(TraceMessages.FilteredRuleNullTarget);

                return Task.FromResult<Content<IDocument>>(content.ToFiltered());
            }

            trace?.Invoke($"The rule matched so loading its target instead: {rule.TargetId}.");

            return loader.GetContentAsync(mode, rule.TargetId, options, trace);
        }
    }

    public const string ErrorPrefix = "Failed evaluation of proxy rules."
                                      + " We can't guarantee relevant proxy target (e.g. according to regulatory requirements). That's why the content is Invalid."
                                      + " Error details: ";

    public static class TraceMessages
    {
        public const string RuleNotMatched = "The rule didn't match.";
        public const string RuleMatchedAsLastForClient = "The rule matched so this is last one for the client and remaining ones are skipped.";
        public const string ClientProxy = "Returning client-side proxy with following rules.";
        public const string FilteredPartialForClient = "Filtered out because no rule matched nor evaluated to a client expression.";
        public const string FilteredFullOnServer = "Filtered out because no rule matched.";
        public const string FilteredRuleNullTarget = "Filtered out because the rule matched but has no target ID.";
    }
}
