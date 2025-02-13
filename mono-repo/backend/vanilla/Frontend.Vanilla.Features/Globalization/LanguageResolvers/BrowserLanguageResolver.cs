using System.Linq;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Tries to resolve allowed language corresponding to user's browser settings.
/// </summary>
internal interface IBrowserLanguageResolver
{
    LanguageInfo? Resolve();
    string? DefaultCulture { get; }
}

internal sealed class BrowserLanguageResolver(
    ILanguageByNameResolver languageByNameResolver,
    IHttpContextAccessor httpContextAccessor)
    : IBrowserLanguageResolver
{
    public LanguageInfo? Resolve()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var languageHeader = QualityHeader.Parse(httpContext.Request.Headers[HttpHeaders.AcceptLanguage]);

        var language = languageHeader
            .Select(h => h.Split(';')[0].Trim())
            .Where(n => !n.IsNullOrWhiteSpace())
            .Select(languageByNameResolver.Resolve)
            .FirstOrDefault(l => l != null);

        return language;
    }

    public string? DefaultCulture
    {
        get
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();
            var languageHeader = QualityHeader.Parse(httpContext.Request.Headers[HttpHeaders.AcceptLanguage]);

            var language = languageHeader.FirstOrDefault(l => l != null);

            return language;
        }
    }
}
