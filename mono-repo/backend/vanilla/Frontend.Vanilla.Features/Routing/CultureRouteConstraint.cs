using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Frontend.Vanilla.Features.Routing;

/// <summary>
/// Limits <see cref="RouteValueKeys.Culture" /> route value to configured languages only.
/// </summary>
internal interface ICultureRouteConstraint : IRouteConstraint { }

internal sealed class CultureRouteConstraint(ICultureUrlTokenResolver cultureUrlTokenResolver) : ICultureRouteConstraint
{
    public bool Match(HttpContext? httpContext, IRouter? route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
    {
        var culture = values[parameterName]?.ToString();

        if (string.IsNullOrWhiteSpace(culture) || culture == "health")
            return false;

        return cultureUrlTokenResolver.IsValidCultureUrlToken(culture);
    }
}
