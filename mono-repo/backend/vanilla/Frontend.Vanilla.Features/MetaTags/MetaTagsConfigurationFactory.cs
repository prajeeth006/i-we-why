#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.MetaTags;

/// <summary>
/// Custom creation logic for <see cref="IMetaTagsConfiguration" />.
/// </summary>
internal sealed class MetaTagsConfigurationFactory : SimpleConfigurationFactory<IMetaTagsConfiguration, MetaTagsConfigurationDto>
{
    public override IMetaTagsConfiguration Create(MetaTagsConfigurationDto dto)
    {
        var errors = new List<ValidationResult>();
        var pageMetaTags = DeserializePageMetaTags(dto.PageMetaTags, errors);
        var globalMetaTags = DeserializeGlobalMetaTags(dto.GlobalMetaTags);

        return errors.Count == 0
            ? new MetaTagsConfiguration(pageMetaTags, globalMetaTags)
            : throw new InvalidConfigurationException(errors);
    }

    private static IReadOnlyList<PageMetaTagsRule> DeserializePageMetaTags(Dictionary<string, PageMetaTagsRuleDto> dtos, ICollection<ValidationResult> errors)
    {
        const string keyDesc = "Page URL (key)";
        var pageMetaTags = new List<(string OriginalUrl, PageMetaTagsRule Rule)>(dtos.Count);

        foreach (var dto in dtos)
        {
            if (!dto.Key.StartsWith("/") || !Uri.TryCreate("http://dummy" + dto.Key, UriKind.Absolute, out var url))
            {
                AddRuleError($"{keyDesc} must be valid rooted (starting with slash '/') relative URL.");

                continue;
            }

            var rawQuery = HttpUtility.ParseQueryString(url.Query);
            var queryParams = new Dictionary<string, string>(rawQuery.Count);

            if (!string.IsNullOrEmpty(url.Fragment))
                AddRuleError($"{keyDesc} contains fragment '{url.Fragment}' which isn't supported.");

            foreach (var key in rawQuery.AllKeys)
            {
                var values = rawQuery.GetValuesForExistingKey(key);
                queryParams.Add(key, values[0]);

                if (string.IsNullOrWhiteSpace(key))
                    AddRuleError($"Query string parameter in {keyDesc.ToCamelCase()} can't be empty nor white-space string but there is one with value '{values[0]}'.");

                if (values.Length > 1)
                    AddRuleError(
                        $"Query string parameter '{key}' in {keyDesc.ToCamelCase()} is specified multiple times with values {values.Select(v => $"'{v}'").Join()} which isn't supported.");
            }

            var tags = dto.Value.Tags.ToDictionary();
            if (dto.Value.Description != null)
                tags[nameof(PageMetaTagsRuleDto.Description).ToCamelCase()] = dto.Value.Description;

            pageMetaTags.Add((dto.Key, new PageMetaTagsRule(url.AbsolutePath, queryParams, dto.Value.Title, tags)));

            void AddRuleError(string error)
                => AddError($"[{dto.Key}] - {error}");
        }

        var comparer = MetaTagsConfigurationDto.Comparison.ToComparer();
        var urlConflicts = pageMetaTags.FindDuplicatesBy(r => r.Rule.UrlPath + "?" + r.Rule.UrlQueryParams.OrderBy(p => p.Key, comparer).Join(), comparer);

        foreach (var c in urlConflicts)
            AddError(
                $" - Multiple rules have semantically equal {keyDesc.ToCamelCase()} (case-insensitive comparison, any order of query parameters) hence they are in conflict: "
                + c.Select(r => $"'{r.OriginalUrl}'").Join(" vs. ") + ".");

        return pageMetaTags
            .ConvertAll(t => t.Rule)
            .OrderByDescending(r => r.UrlQueryParams.Count) // More specific rules with query params should go first
            .ToList()
            .AsReadOnly();

        void AddError(string error)
            => errors.Add(new ValidationResult("PageMetaTags" + error, new[] { nameof(MetaTagsConfigurationDto.PageMetaTags) }));
    }

    private static IReadOnlyList<GlobalMetaTagsRule> DeserializeGlobalMetaTags(Dictionary<string, GlobalMetaTagsRuleDto> dtos)
        => dtos.ConvertAll(d => new GlobalMetaTagsRule(d.Key, d.Value.Tags, d.Value.UrlPathAndQueryRegexes))
            .OrderBy(t => t.RuleName) // Defines which rule prevails in the end
            .ToList()
            .AsReadOnly();
}
