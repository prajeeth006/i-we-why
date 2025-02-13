using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Frontend.Host.Features.AuthRequired;

internal class AuthRequiredMiddleware(
    RequestDelegate next,
    IAuthorizationConfiguration authorizationConfiguration,
    IEndpointMetadata endpointMetadata,
    ICultureUrlTokenResolver cultureUrlTokenResolver,
    ILanguageService languageService)
    : Middleware(next)
{
    private const string LoginUrl = "/labelhost/login";

    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!httpContext.Request.Path.HasValue
            || httpContext.Request.Path.Value.Contains(LoginUrl, StringComparison.OrdinalIgnoreCase)
            || httpContext.User.Identity?.IsAuthenticated is true
            || !endpointMetadata.Contains<ServesHtmlDocumentAttribute>()
            || authorizationConfiguration.AuthRequired.IsNullOrEmpty()) return Next(httpContext);

        var authRequired = authorizationConfiguration.AuthRequired.Any(pattern => Regex.IsMatch(httpContext.Request.Path.Value, pattern, RegexOptions.IgnoreCase));

        if (authRequired)
        {
            var (token, _) = cultureUrlTokenResolver.GetToken(httpContext);
            var queryParams = new Dictionary<string, StringValues>
            {
                { "rurlauth", "1" },
                { "rurl", httpContext.Request.GetFullUrl().ToString() },
            };
            var targetBuilder = new UriBuilder { Query = QueryUtil.Build(queryParams) }
                .AppendPathSegment(token ?? languageService.Default.RouteValue)
                .AppendPathSegment(LoginUrl);

            httpContext.Response.Redirect(targetBuilder.Uri.PathAndQuery, source: this);
        }

        return Next(httpContext);
    }
}
