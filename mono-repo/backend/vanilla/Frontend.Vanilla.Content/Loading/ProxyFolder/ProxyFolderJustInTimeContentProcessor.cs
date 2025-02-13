using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Content.Loading.ProxyFolder;

/// <summary>
/// If content item is proxy folder, redirects result to first child according to its DSL rules.
/// As far as DSL expressions are user specific, result can't be cached.
/// See <see cref="ProxyFolderPreCachingContentProcessor" /> which must be executed before.
/// </summary>
internal sealed class ProxyFolderJustInTimeContentProcessor : IJustInTimeContentProcessor
{
    public async Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object> trace)
    {
        try
        {
            trace?.Invoke($"Evaluating {options.DslEvaluation} proxy folder with following children.");
            var children = content.Metadata.ChildIds;
            trace?.Invoke(children);

            switch (options.DslEvaluation)
            {
                case DslEvaluation.PartialForClient:
                    var clientRules = new List<ProxyFolderChildItem>(content.Metadata.ChildIds.Count);
                    var childrenTasks = children.Select(c => loader.GetContentAsync(mode, c, options, trace));
                    var items = await Task.WhenAll(childrenTasks);
#pragma warning disable CA2021
                    var filterItems = items.Cast<SuccessContent<IDocument>>().Select(f => f.Document).Cast<IFilterTemplate>().ToArray();
#pragma warning restore CA2021

                    if (filterItems.Length != items.Length)
                    {
                        var invalidIds = items.Where(i => !filterItems.Any(f => f.Metadata.Id.Equals(i.Id)))
                            .Select(i => i.Id).Join();
                        trace?.Invoke(
                            $"Attempted to use proxy folder where following children {invalidIds} don't support IFilterTemplate. Returning filtered content as this is not supported.");

                        return content.ToFiltered();
                    }

                    foreach (var item in filterItems)
                    {
                        trace?.Invoke($"Preparing child with id {item.Metadata.Id}.");
                        var dslResult = item.Condition != null ? ClientEvaluationResult<bool>.FromClientExpression(item.Condition) : null;

                        if (dslResult == null || (dslResult.HasFinalValue && dslResult.Value)) // If fully matched -> will always match on client too
                        {
                            if (clientRules.Count == 0)
                                return items.First(i => i.Id.Equals(item.Metadata.Id)); // No previous partially matched rules -> no proxy but return target content

                            trace?.Invoke(TraceMessages.RuleMatchedAsLastForClient);
                            clientRules.Add(new ProxyFolderChildItem(null, item));

                            break;
                        }

                        if (!dslResult.HasFinalValue)
                        {
                            trace?.Invoke($"The rule evaluated to client expression '{dslResult.ClientExpression}'.");
                            clientRules.Add(new ProxyFolderChildItem(dslResult.ClientExpression, item));
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

                    trace?.Invoke(TraceMessages.ClientProxyFolder);
                    trace?.Invoke(clientRules);
                    var a = new VanillaProxyFolderDocument(content.Document, clientRules.AsReadOnly());
                    var n = new SuccessContent<IDocument>(a);

                    return n;

                case DslEvaluation.FullOnServer:
                    foreach (var child in children)
                    {
                        trace?.Invoke($"Evaluating child with Id {child.Id}.");
                        var item = await loader.GetContentAsync(mode, child, options, trace);

                        if (item.Status == DocumentStatus.Success)
                            return item;

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
    }

    public const string ErrorPrefix = "Failed evaluation of proxy folder rules."
                                      + " We can't guarantee relevant proxy folder target (e.g. according to regulatory requirements). That's why the content is Invalid."
                                      + " Error details: ";

    public static class TraceMessages
    {
        public const string RuleNotMatched = "The rule didn't match.";
        public const string RuleMatchedAsLastForClient = "The rule matched so this is last one for the client and remaining ones are skipped.";
        public const string ClientProxyFolder = "Returning client-side proxy folder with following rules.";
        public const string FilteredPartialForClient = "Filtered out because no rule matched nor evaluated to a client expression.";
        public const string FilteredFullOnServer = "Filtered out because no rule matched.";
    }
}
