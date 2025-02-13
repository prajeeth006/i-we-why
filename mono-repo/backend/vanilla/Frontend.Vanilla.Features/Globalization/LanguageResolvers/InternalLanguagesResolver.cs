using System.Collections.Generic;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Globalization.Configuration;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Resolves internal language for current context which means:
/// returns all configured internal languages if the request is internal - made from comparny network.
/// </summary>
internal interface IInternalLanguagesResolver
{
    IEnumerable<LanguageInfo> Resolve();
}

internal sealed class InternalLanguagesResolver(IGlobalizationConfiguration config, IInternalRequestEvaluator requestEvaluator) : IInternalLanguagesResolver
{
    public IEnumerable<LanguageInfo> Resolve()
    {
        if (!requestEvaluator.IsInternal())
            yield break;

        foreach (var lang in config.InternalLanguages)
            yield return lang;
    }
}
