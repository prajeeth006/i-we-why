using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.Routing;

/// <summary>Endpoint.</summary>
public static class EndpointRouteBuilderExtensions
{
    /// <summary>
    /// Maps client bootstrap page route.
    /// </summary>
    public static void MapClientBootstrapRoute(this IEndpointRouteBuilder builder, string name, string pattern)
    {
        var constraints = GetCultureConstraint(builder, pattern);
        builder.MapControllerRoute(
                name: name,
                pattern: pattern,
                defaults: new
                {
                    controller = nameof(HostController).RemoveSuffix("Controller"),
                    action = nameof(HostController.Index),
                },
                constraints: constraints)
            .ServesHtmlDocument();
    }

    /// <summary>Maps public page route.</summary>
    public static void MapPublicPageRoute(this IEndpointRouteBuilder builder, string name, string pattern, string path)
    {
        builder.MapControllerRoute(
                name: name,
                pattern: pattern,
                defaults: new
                {
                    controller = nameof(HostController).RemoveSuffix("Controller"),
                    action = nameof(HostController.Index),
                },
                constraints: GetCultureConstraint(builder, pattern))
            .ServesHtmlDocument().ServesPublicPages(path);
    }

    private static object? GetCultureConstraint(IEndpointRouteBuilder builder, string pattern)
    {
        if (pattern.Contains(RouteValueKeys.Culture, StringComparison.OrdinalIgnoreCase))
        {
            return new
            {
                culture = new CultureRouteConstraint(builder.ServiceProvider.GetRequiredService<ICultureUrlTokenResolver>()),
            };
        }

        return null;
    }
}
