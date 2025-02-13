using System.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.Middlewares;

/// <summary>
/// Sets up default language before authentication. Then we evaluate culture for particular user (hidden languages are user-specific).
/// </summary>
internal sealed class DefaultLanguageMiddleware(RequestDelegate next, IGlobalizationConfiguration globalizationConfiguration) : BeforeNextMiddleware(next)
{
    public override void BeforeNext(HttpContext httpContext)
        => CultureInfoHelper.SetCurrent(globalizationConfiguration.DefaultLanguage.Culture);
}
