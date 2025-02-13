using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.LazyFeatures;

internal class StrategyOptions(IDslExpression<bool> rule, int delay)
{
    public IDslExpression<bool> Rule { get; } = rule;
    public int Delay { get; } = delay;
}

internal class StyleOptions(string id, string type, string? htmlCssClass)
{
    public string Id { get; } = id;
    public string Type { get; } = type;
    public string? HtmlCssClass { get; } = htmlCssClass;
}

internal class FeatureOptions(
    string? id,
    IDslExpression<bool>? rule,
    int? delay,
    string? strategy,
    IReadOnlyList<StyleOptions>? styles,
    Dictionary<string, string[]>? events)
{
    public string? Id { get; set; } = id;
    public IDslExpression<bool>? Rule { get; set; } = rule;
    public int? Delay { get; set; } = delay;
    public string? Strategy { get; set; } = strategy;
    public IReadOnlyList<StyleOptions>? Styles { get; set; } = styles;
    public Dictionary<string, string[]>? Events { get; set; } = events;
}

internal sealed class EvaluatedOptions(
    ClientEvaluationResult<bool> enabled,
    string? enabledSource,
    string? id = null,
    string? strategy = null,
    IReadOnlyList<StyleOptions>? styles = null,
    int? delay = null,
    Dictionary<string, string[]>? events = null)
{
    public ClientEvaluationResult<bool> Enabled { get; } = enabled;
    public string? EnabledSource { get; } = enabledSource;
    public string? Id { get; } = id;
    public string? Strategy { get; } = strategy;
    public IReadOnlyList<StyleOptions>? Styles { get; } = styles;
    public int? Delay { get; } = delay;
    public Dictionary<string, string[]>? Events { get; } = events;
}
