#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Validation;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.MetaTags;

/// <summary>
/// Data for creating <see cref="IMetaTagsConfiguration" />.
/// </summary>
internal sealed class MetaTagsConfigurationDto : IValidatableObject
{
    public const StringComparison Comparison = StringComparison.InvariantCultureIgnoreCase; // URLs and meta tags are case-insensitive and can contain localized chars

    [Required, RequiredKeys, RequiredValues, UniqueKeys(Comparison)]
    public Dictionary<string, PageMetaTagsRuleDto> PageMetaTags { get; set; }

    [Required, RequiredKeys, RequiredValues, UniqueKeys(Comparison)]
    public Dictionary<string, GlobalMetaTagsRuleDto> GlobalMetaTags { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        => ObjectValidator.ValidateDictionaryValues(PageMetaTags, nameof(PageMetaTags))
            .Concat(ObjectValidator.ValidateDictionaryValues(GlobalMetaTags, nameof(GlobalMetaTags)));
}

internal sealed class PageMetaTagsRuleDto : IValidatableObject
{
    public string Title { get; set; }
    public string Description { get; set; }

    [Required, RequiredKeys, UniqueKeys(MetaTagsConfigurationDto.Comparison)]
    public Dictionary<string, string> Tags { get; set; } = new Dictionary<string, string>(); // Null values are used to remove the tag

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Title == null && Description == null && Tags.Count == 0)
            yield return new ValidationResult("Title and Description are null and no Tags are defined. So what's the point of having this rule?");

        var otherDesc = Tags.FirstOrDefault(t => t.Key.Equals(nameof(Description), StringComparison.OrdinalIgnoreCase));

        if (Description != null && otherDesc.Key != null)
            yield return new ValidationResult(
                "Description can't be specified both in Tags and dedicated property."
                + $" Tags[{otherDesc.Key}] is '{otherDesc.Value}' vs. dedicated Description is '{Description}'.");
    }
}

internal sealed class GlobalMetaTagsRuleDto : IValidatableObject
{
    [Required, RequiredKeys, NotEmptyCollection, UniqueKeys(MetaTagsConfigurationDto.Comparison)]
    public Dictionary<string, string> Tags { get; set; } // Null values are used to remove the tag

    [Required, RequiredItems, NotEmptyCollection, UniqueItems(MetaTagsConfigurationDto.Comparison)]
    public List<string> UrlPathAndQueryRegexes { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var errors = new List<ValidationResult>();

        foreach (var regex in UrlPathAndQueryRegexes)
            try
            {
                // ReSharper disable once ObjectCreationAsStatement
                new Regex(regex);
            }
            catch (Exception ex)
            {
                errors.Add(new ValidationResult($"UrlPathAndQueryRegexes contain invalid regular expression '{regex}' with error: {ex.Message}"));
            }

        return errors;
    }
}
