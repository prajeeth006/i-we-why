using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.CssOverrides;

internal sealed class CssOverride(string id, string content, ClientEvaluationResult<bool>? condition)
{
    public string Id { get; } = id;
    public string Content { get; } = content;
    public ClientEvaluationResult<bool>? Condition { get; } = condition;
}
