using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Implements <see cref="ILanguageService.Allowed" />.
/// </summary>
internal interface IAllowedLanguagesResolver
{
    IReadOnlyList<LanguageInfo> Languages { get; }
}

internal sealed class AllowedLanguagesResolver(
    IGlobalizationConfiguration config,
    IHiddenLanguagesResolver hiddenLanguagesResolver,
    IInternalLanguagesResolver internalLanguagesResolver,
    IHttpContextAccessor httpContextAccessor)
    : IAllowedLanguagesResolver
{
    public IReadOnlyList<LanguageInfo> Languages
    {
        get
        {
            return httpContextAccessor.GetOrAddScopedValue("Van:AllowedLangs", _ => ResolveLanguages());
        }
    }

    private IReadOnlyList<LanguageInfo> ResolveLanguages()
        => config.AllowedLanguages
            .Concat(internalLanguagesResolver.Resolve())
            .Except(hiddenLanguagesResolver.Resolve())
            .ToList();
}
