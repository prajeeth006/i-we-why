using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.DomainSpecificActions.Configuration;

/// <summary>
/// Config DTO which needs to get DSL placeholders replaced and action parameters deserialized.
/// </summary>
internal sealed class DsaConfigurationDto : IValidatableObject
{
    public string? HtmlDocumentDslAction { get; set; }

    [Required, RequiredKeys]
    public Dictionary<string, string?> HtmlDocumentPlaceholders { get; set; } = new ();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        foreach (var placeholder in HtmlDocumentPlaceholders.Keys)
            if (DsaPlaceholderReplacer.PlaceholderRegex.Match(placeholder).Length != placeholder.Length)
            {
                var message = $"Placeholder names must match regex '{DsaPlaceholderReplacer.PlaceholderRegex}' but there is '{placeholder}' which does not.";

                yield return new ValidationResult(message, new[] { nameof(HtmlDocumentPlaceholders) });
            }
    }
}
