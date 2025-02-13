using System.Collections.Generic;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.CssOverrides;

internal interface ICssOverridesProvider
{
    IEnumerable<CssOverride> Get();
}

internal sealed class CssOverridesProvider : ICssOverridesProvider
{
    private readonly IContentService contentService;
    private readonly string overridesFolder;

    public CssOverridesProvider(IContentService contentService, VanillaVersion vanillaVersion)
    {
        this.contentService = contentService;
        overridesFolder = $"App-v1.0/CssOverrides/van{vanillaVersion.Version.Major}";
    }

    public IEnumerable<CssOverride> Get()
    {
        var folder = contentService.GetRequired<IFolder>(overridesFolder, new ContentLoadOptions { PrefetchDepth = 2, DslEvaluation = DslEvaluation.PartialForClient });

        return ResolveCss(folder);
    }

    private IEnumerable<CssOverride> ResolveCss(IDocument root)
    {
        var queue = new Queue<IDocument>();
        var result = new List<CssOverride>();

        queue.Enqueue(root);

        while (queue.Count > 0)
        {
            var item = queue.Dequeue();

            if (item is IStaticFileTemplate file)
            {
                var validSanitizedContent = Sanitize(file.Content);

                if (validSanitizedContent == null) continue;

                result.Add(new CssOverride(file.Metadata.Id.ItemName,
                    validSanitizedContent,
                    file.Condition != null ? ClientEvaluationResult<bool>.FromClientExpression(file.Condition) : null));
            }
            else
            {
                var subItems = contentService.GetChildren<IDocument>(item, new ContentLoadOptions { DslEvaluation = DslEvaluation.PartialForClient });

                foreach (var subItem in subItems)
                {
                    queue.Enqueue(subItem);
                }
            }
        }

        return result;
    }

    private static string? Sanitize(string? css)
    {
        return css != null ? Regex.Replace(css, @"<\/?[\w\s]*>|<.+[\W]>", "") : null;
    }
}
