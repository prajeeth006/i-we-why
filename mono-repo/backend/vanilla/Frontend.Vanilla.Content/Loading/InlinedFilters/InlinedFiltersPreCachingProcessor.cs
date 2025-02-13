using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Content.Loading.InlinedFilters;

/// <summary>
/// Discovers and compiles all filters inlined in HTML using 'data-content-filter' attribute in all fields.
/// </summary>
internal sealed class InlinedFiltersPreCachingProcessor(IDslCompiler dslCompiler, ILogger<InlinedFiltersPreCachingProcessor> log) : SyncPreCachingContentProcessor
{
    public const string AttributeName = "data-content-filter";

    public override Content<IDocument> Process(SuccessContent<IDocument> content, ICollection<IJustInTimeContentProcessor> justInTimeProcessors, Action<object> trace)
    {
        try
        {
            var namesOfFieldsWithFilters = new List<TrimmedRequiredString>();
            var filterExpressions = new Dictionary<RequiredString, IDslExpression<bool>>();

            foreach (var field in content.Document.Data.Fields)
            {
                if (!(field.Value is string fieldValue))
                    continue;

                var settings = new JsonSerializerSettings
                {
                    Error = (_, args) => { args.ErrorContext.Handled = true; },
                    MissingMemberHandling = MissingMemberHandling.Error,
                };
                var jsonResult = JsonConvert.DeserializeObject(fieldValue, settings);

                if (jsonResult != null)
                    continue; // Not supporting Json structure parsing for this feature.

                var fieldHtml = new HtmlDocument();
                fieldHtml.LoadHtml(fieldValue);

                foreach (var node in fieldHtml.DocumentNode.SelectNodes("//@" + AttributeName).NullToEmpty())
                {
                    var expressionString = RequiredString.TryCreate(node.Attributes[AttributeName].Value)
                                           ?? throw new Exception($"Field '{field.Key}' contains empty (hence invalid) inlined filter attribute '{AttributeName}'"
                                                                  + $" at position {node.StreamPosition} with text '{node.OuterHtml.SubstringMax(0, maxLength: 50)}'.");

                    var (expression, warnings) = dslCompiler.Compile<bool>(expressionString);

                    if (warnings.Count > 0)
                        log.LogWarning(
                            "Content {id} contains {field} with {filter} inlined in HTML using {attribute} with {warnings}",
                            content.Id.ToString(),
                            field.Key,
                            expressionString.Value,
                            AttributeName,
                            warnings.ToDebugString());

                    namesOfFieldsWithFilters.Add(field.Key);
                    filterExpressions[expressionString] = expression;
                }
            }

            if (filterExpressions.Count > 0)
                justInTimeProcessors.Add(new InlinedFiltersJustInTimeProcessor(namesOfFieldsWithFilters, filterExpressions));

            return content;
        }
        catch (Exception ex)
        {
            return content.ToInvalid($"Failed preparation of filters inlined in HTML using '{AttributeName}' attribute: {ex}");
        }
    }
}
