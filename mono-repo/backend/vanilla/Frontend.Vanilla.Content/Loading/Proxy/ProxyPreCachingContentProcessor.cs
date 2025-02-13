using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.Loading.Proxy;

/// <summary>
/// Compiles DSL expressions in proxy item rules.
/// </summary>
internal sealed class ProxyPreCachingContentProcessor(IDslCompiler dslCompiler, ILogger<ProxyPreCachingContentProcessor> log) : SyncPreCachingContentProcessor
{
    public override Content<IDocument> Process(SuccessContent<IDocument> content, ICollection<IJustInTimeContentProcessor> justInTimeProcessors, Action<object> trace)
    {
        if (!(content.Document is IProxy proxy))
        {
            trace?.Invoke(TraceMessages.NotProxy);

            return content;
        }

        if (proxy.Target.Count == 0)
        {
            trace?.Invoke(TraceMessages.NoRules);

            return content.ToFiltered();
        }

        try
        {
            trace?.Invoke(TraceMessages.Preparing);
            trace?.Invoke(proxy.Target);
            var compiledRules = new List<CompiledProxyRule>(proxy.Target.Count);

            foreach (var rule in proxy.Target)
            {
                if (string.IsNullOrWhiteSpace(rule.Condition))
                {
                    trace?.Invoke($"No compilation of rule (null => {rule.TargetId.Dump()}) because it has no Condition and remaining rules are skipped.");
                    compiledRules.Add(new CompiledProxyRule(condition: null, rule.TargetId));

                    break;
                }

                trace?.Invoke($"Compiling Condition of the rule ('{rule.Condition}' => {rule.TargetId.Dump()}) to following DSL expression.");
                var dslResult = dslCompiler.Compile<bool>(rule.Condition);
                trace?.Invoke(dslResult.Value);

                if (dslResult.Warnings.Count > 0)
                {
                    trace?.Invoke(TraceMessages.DslWarnings);
                    trace?.Invoke(dslResult.Warnings);
                    log.LogWarning("Content Proxy {id} has a rule ({condition} => {targetId}) with {warnings}",
                        content.Id,
                        rule.Condition,
                        rule.TargetId?.ToString(),
                        dslResult.Warnings.ToDebugString());
                }

                compiledRules.Add(new CompiledProxyRule(dslResult.Value, rule.TargetId));
            }

            trace?.Invoke(TraceMessages.Prepared);
            trace?.Invoke(compiledRules);
            justInTimeProcessors.Clear(); // Process proxy standalone, matched target gets full processing on its own
            justInTimeProcessors.Add(new ProxyJustInTimeContentProcessor(compiledRules));

            return content;
        }
        catch (Exception ex)
        {
            trace?.Invoke(ErrorPrefix + ex);

            return content.ToInvalid(ErrorPrefix + ex);
        }
    }

    public const string ErrorPrefix = "Failed preparation of proxy rules: ";

    public static class TraceMessages
    {
        public const string NotProxy = "No proxy processing because the content isn't a proxy.";
        public const string NoRules = "Filtered out because the content is a proxy with no rules.";
        public const string Preparing = "Preparing following proxy rules.";
        public const string Prepared = "Prepared following proxy rules.";
        public const string DslWarnings = "The DSL expression has following warnings.";
    }
}
