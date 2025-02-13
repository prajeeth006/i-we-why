using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;
using HtmlAgilityPack;

namespace Frontend.Vanilla.Content.Loading.InlinedFilters;

/// <summary>
/// Evaluates filters inlined in content fields and manipulates their HTML accordingly - removing it or setting client expression for later evaluation in browser.
/// </summary>
internal sealed class InlinedFiltersJustInTimeProcessor(
    IEnumerable<TrimmedRequiredString> namesOfFieldsWithFilters,
    IEnumerable<KeyValuePair<RequiredString, IDslExpression<bool>>> filterExpressions)
    : IJustInTimeContentProcessor
{
    private const string AttributeName = InlinedFiltersPreCachingProcessor.AttributeName;

    public IReadOnlyList<TrimmedRequiredString> NamesOfFieldsWithFilters { get; } = Guard
        .NotEmptyNorNullItems(namesOfFieldsWithFilters?.Enumerate(), nameof(namesOfFieldsWithFilters))
        .Distinct(RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed()).ToArray();

    public IReadOnlyDictionary<RequiredString, IDslExpression<bool>> FilterExpressions { get; } =
        Guard.NotEmptyNorNullValues(filterExpressions?.ToDictionary(), nameof(filterExpressions));

    public async Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object> trace)
    {
        try
        {
            var fieldsWithFilters = EnumerableExtensions.ToDictionary(BuildFilterableHtmlFieldTrees(content), RequiredStringComparer.OrdinalIgnoreCase);

            if (fieldsWithFilters.Count == 0)
                return content;

            var evaluatedExpressions = new Dictionary<IDslExpression<bool>, ClientEvaluationResult<bool>>();
            var nodesToProcess = fieldsWithFilters.Values.SelectMany(v => v.Nodes).ToList();

            while (nodesToProcess.Count > 0)
            {
                var expressionsToEvaluate = nodesToProcess
                    .ConvertAll(n => n.FilterExpression)
                    .Where(e => !evaluatedExpressions.ContainsKey(e))
                    .ToList();

                // Key point: evaluate all placeholders from all fields in parallel ;-)
                if (expressionsToEvaluate.Count > 0)
                    evaluatedExpressions.Add(await expressionsToEvaluate.EvaluateAllAsync(mode, options));

                nodesToProcess = ApplyFilters(nodesToProcess, evaluatedExpressions);
            }

            var filteredFields = fieldsWithFilters.ConvertAll(f => (f.Key.Value, (object)f.Value.HtmlDocument.DocumentNode.OuterHtml));

            return content.WithFieldsOverwritten(filteredFields);
        }
        catch (Exception ex)
        {
            return content.ToInvalid($"Failed runtime evaluation of filters inlined in HTML using '{AttributeName}' attributes."
                                     + " We can't guarantee relevant content field values. That's why it is completely Invalid."
                                     + " Error details: " + ex);
        }
    }

    private static List<FilterableHtmlNode> ApplyFilters(IEnumerable<FilterableHtmlNode> nodes,
        IReadOnlyDictionary<IDslExpression<bool>, ClientEvaluationResult<bool>> evaluatedExpressions)
    {
        var nextNodesToProcess = new List<FilterableHtmlNode>();

        foreach (var node in nodes)
            switch (evaluatedExpressions[node.FilterExpression])
            {
                case var notFinal when !notFinal.HasFinalValue:
                    node.FilterAttribute.Value = notFinal.ClientExpression;
                    nextNodesToProcess.AddRange(node.Children);

                    break;

                case var passed when passed.Value:
                    node.FilterAttribute.Remove();
                    nextNodesToProcess.AddRange(node.Children);

                    break;

                case var filtered when !filtered.Value:
                    node.HtmlNode.Remove(); // Also we won't evaluate child nodes

                    break;

                default:
                    throw new VanillaBugException();
            }

        return nextNodesToProcess;
    }

    private IEnumerable<KeyValuePair<TrimmedRequiredString, FilterableHtmlTree>> BuildFilterableHtmlFieldTrees(SuccessContent<IDocument> content)
    {
        foreach (var fieldName in NamesOfFieldsWithFilters)
        {
            var fieldValue = (string)content.Document.Data.Fields[fieldName];

            if (string.IsNullOrWhiteSpace(fieldValue) || !fieldValue.Contains(AttributeName, StringComparison.OrdinalIgnoreCase))
                continue;

            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(fieldValue);

            var nodes = FindFilterableChildNodes(htmlDocument.DocumentNode, fieldName).ToList();

            if (nodes.Count > 0)
                yield return KeyValue.Get(fieldName, new FilterableHtmlTree { HtmlDocument = htmlDocument, Nodes = nodes });
        }
    }

    private IEnumerable<FilterableHtmlNode> FindFilterableChildNodes(HtmlNode parentHtmlNode, TrimmedRequiredString fieldName)
    {
        foreach (var htmlNode in parentHtmlNode.ChildNodes.Where(n => n.NodeType == HtmlNodeType.Element))
        {
            var attribute = htmlNode.Attributes[AttributeName];

            if (attribute != null)
                yield return new FilterableHtmlNode
                {
                    HtmlNode = htmlNode,
                    FilterAttribute = attribute,
                    FilterExpression = FilterExpressions.GetValue(attribute.Value)
                                       ?? throw new Exception(
                                           $"Field '{fieldName}' contains {AttributeName}='{attribute.Value}' which was unexpectedly added in the meantime or filter discovery has a bug."
                                           + $" It's not prepared (DSL compiled) so can't be evaluated just-in-time. Prepared ones: {FilterExpressions.Keys.Dump()}."),
                    Children = FindFilterableChildNodes(htmlNode, fieldName).ToList(),
                };
            else
                foreach (var filterable in FindFilterableChildNodes(htmlNode, fieldName))
                    yield return filterable;
        }
    }

    private sealed class FilterableHtmlTree
    {
        public HtmlDocument HtmlDocument { get; set; }
        public IReadOnlyList<FilterableHtmlNode> Nodes { get; set; }
    }

    internal sealed class FilterableHtmlNode
    {
        public HtmlNode HtmlNode { get; set; }
        public HtmlAttribute FilterAttribute { get; set; }
        public IDslExpression<bool> FilterExpression { get; set; }
        public IReadOnlyList<FilterableHtmlNode> Children { get; set; }
    }
}
