using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.DynamicLayout;

internal class SlotConfiguration(string type, IDslExpression<bool> isEnabledCondition, IEnumerable<string>? path)
{
    [Required]
    public string Type { get; set; } = type;

    [Required]
    public IDslExpression<bool> IsEnabledCondition { get; set; } = isEnabledCondition;

    public IEnumerable<string> Path { get; set; } = path ?? new List<string>();
}
