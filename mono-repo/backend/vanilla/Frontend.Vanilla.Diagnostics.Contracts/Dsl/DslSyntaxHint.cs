using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Dsl;

public sealed class DslSyntaxHint(string htmlId, IEnumerable<string> keywordHtmls, string description, IEnumerable<string> exampleHtmls)
{
    public string HtmlId { get; } = htmlId;
    public IReadOnlyList<string> KeywordHtmls { get; } = keywordHtmls.ToList();
    public string Description { get; } = description;
    public IReadOnlyList<string> ExampleHtmls { get; } = exampleHtmls.ToList();
}
