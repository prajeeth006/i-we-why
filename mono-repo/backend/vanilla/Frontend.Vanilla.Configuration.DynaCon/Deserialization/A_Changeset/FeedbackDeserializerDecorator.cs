using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;

/// <summary>
/// Sends feedback to DynaCon regarding validity of deserialized changesets.
/// </summary>
internal sealed class FeedbackDeserializerDecorator(
    IChangesetDeserializer inner,
    DynaConEngineSettings settings,
    IConfigurationRestService restService,
    IContextHierarchyExpander contextExpander,
    ILogger<FeedbackDeserializerDecorator> log)
    : IChangesetDeserializer
{
    public IValidChangeset Deserialize(ConfigurationResponse changesetDto, VariationHierarchyResponse contextHierarchy, ConfigurationSource source)
    {
        if (!settings.SendFeedback || source != ConfigurationSource.Service)
            return inner.Deserialize(changesetDto, contextHierarchy, source);

        try
        {
            var changeset = inner.Deserialize(changesetDto, contextHierarchy, source);
            restService.PostValidChangesetFeedback(changesetDto.ChangesetId, changesetDto.LastCommitId);

            return changeset;
        }
        catch (ChangesetDeserializationException ex)
        {
            var details = ExtractDetails(ex);
            restService.PostInvalidChangesetFeedback(changesetDto.ChangesetId, changesetDto.LastCommitId, ex.Message, details);

            throw;
        }

        IEnumerable<ProblemDetail> ExtractDetails(ChangesetDeserializationException exception) =>
            from partialEx in exception.FailedChangeset.Errors
            let featureEx = partialEx.ExtractInner<FeatureDeserializationException>()
            from varCtxEx in AtLeastOne(featureEx.ExtractAllInner<InstanceDeserializationException>())
            let keysEx = varCtxEx?.ExtractInner<InvalidConfigurationException>()
            from error in AtLeastOne(keysEx?.Errors)
            let members = new KeySet(error?.MemberNames)
            group varCtxEx?.Context by new
            {
                Feature = featureEx?.FeatureName,
                Members = members,
                Keys = new KeySet(members.Select(m => m.Split('.', '[').First().Trim())), // DynaCon key corresponds only to first property on the path
                Description = error?.ErrorMessage
                              ?? featureEx?.GetMessageIncludingInner()
                              ?? partialEx.GetMessageIncludingInner(),
            }
            into g
            select new ProblemDetail
            {
                Feature = g.Key.Feature,
                Key = g.Key.Keys.FirstOrDefault(), // No way how to report single error for multiple keys -> at least don't duplicate it
                Description = g.Key.Description,
                AdditionalContexts = GetRelevantContexts(g, g.Key.Feature, g.Key.Keys, g.Key.Members)
                    .Where(c => c.Count > 0) // Empty context is useless to report
                    .Distinct(DictionaryEqualityComparer<string, string>.Singleton)
                    .ToList(),
            };

        IEnumerable<IReadOnlyDictionary<string, string>> GetRelevantContexts(
            IEnumerable<VariationContext> contexts,
            string featureName,
            IReadOnlyCollection<string> keyNames,
            IReadOnlyCollection<string> memberNames)
        {
            var collapsedCtxs = contexts
                .Where(c => c != null)
                .Select(c => GetCollapsedContext(c, contextHierarchy))
                .ToList();

            if (collapsedCtxs.Count == 0 || featureName == null || keyNames.Count == 0)
                return collapsedCtxs;

            var featureDto = changesetDto.Configuration.GetValue(featureName);
            var keyDtos = keyNames.Select(n => featureDto?.GetValue(n)).WhereNotNull().ToList();

            // If we can't normalize contexts properly -> don't normalize at all because some important info could get lost
            if (keyDtos.Count != keyNames.Count)
            {
                var missingKeys = featureDto != null ? keyNames.Except(featureDto.Keys, StringComparer.OrdinalIgnoreCase) : keyNames;
                var keys = ToJson(missingKeys);
                var membersNames = ToJson(memberNames);
                log.LogError(
                    "Unable to find DTOs from DynaCon for {featureName} and {keys} based on {membersNames} reported in ValidationResult-s."
                    + " This causes much more variation contexts to be sent in the feedback making it confusing. Specify proper membersNames when creating (may be indirect) ValidationResult-s",
                    featureName,
                    keys,
                    membersNames);

                return collapsedCtxs;
            }

            // Get all context values for particular key from DynaCon DTO e.g. { environment: [qa, dev], label: [bwin.com, bwin.es] }
            var inputCtxVals = keyDtos
                .SelectMany(d => d.Values)
                .SelectMany(v => v.Context)
                .GroupBy(c => c.Key, c => c.Value, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(g => g.Key, g => g.ToHashSet(StringComparer.OrdinalIgnoreCase), StringComparer.OrdinalIgnoreCase);

            // Remove properties which are not present in input from DynaCon for this key
            return collapsedCtxs.ConvertAll<Dictionary<string, string>>(
                c => Enumerable.ToDictionary(c
                    .Where(p => inputCtxVals.TryGetValue(p.Key, out var vals) && vals.Contains(p.Value)), StringComparer.OrdinalIgnoreCase));
        }
    }

    private IReadOnlyDictionary<string, string> GetCollapsedContext(VariationContext context, VariationHierarchyResponse contextHierarchy)
        => context.Properties.ToDictionary(
            p => p.Key.ToString(),
            p => (string)(p.Value.Count > 1
                // There must be a single value that covers all values together with its children e.g. [qa, qa1, qa2, dev] -> qa
                ? p.Value.Single(v => p.Value.SetEquals(contextExpander.GetChildren(contextHierarchy, p.Key, v).Append(v)))
                : p.Value.First()));

    private static IEnumerable<T?> AtLeastOne<T>(IEnumerable<T>? items)
        where T : class
    {
        var enumerated = items?.Enumerate();

        return enumerated?.Count > 0 ? (IEnumerable<T?>)enumerated : new T?[] { null }; // We need at least one element for linq
    }

    private static string ToJson(object obj) => JsonConvert.SerializeObject(obj);

    private class KeySet(IEnumerable<string>? collection)
        : HashSet<string>(collection.NullToEmpty().Where(k => !string.IsNullOrWhiteSpace(k)), StringComparer.OrdinalIgnoreCase)
    {
        public override bool Equals(object? obj)
            => obj is IEnumerable<string> strs && SetEquals(strs);

        public override int GetHashCode()
            => Count.GetHashCode();
    }
}
