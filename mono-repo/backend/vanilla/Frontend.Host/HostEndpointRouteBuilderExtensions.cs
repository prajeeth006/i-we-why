using Frontend.Host.Features.HttpForwarding;
using Frontend.Host.Features.PageNotFound;
using Frontend.Host.Features.Routing;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host;

internal static class HostEndpointRouteBuilderExtensions
{
    public static void MapHostEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapHostHttpForwarding();
        endpointRouteBuilder.MapClientBootstrapRoute("default", "");
        endpointRouteBuilder.MapClientBootstrapRoute("default-with-culture", "{culture}");
        endpointRouteBuilder.MapClientBootstrapRoute("account-menu", "{culture}/menu/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("cashier", "{culture}/cashier/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("settings", "{culture}/settings/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("product-menu", "{culture}/product-menu/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("logout", "{culture}/logout");
        endpointRouteBuilder.MapClientBootstrapRoute("profile", "{culture}/profile");
        endpointRouteBuilder.MapClientBootstrapRoute("inbox", "{culture}/inbox");
        endpointRouteBuilder.MapClientBootstrapRoute("danske-spil-login-success", "{culture}/danske-spil/login-success");
        endpointRouteBuilder.MapClientBootstrapRoute("preferences-dark-mode", "{culture}/preferences/dark-mode");
        endpointRouteBuilder.MapClientBootstrapRoute("account", "{culture}/account/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("labelhost", "{culture}/labelhost/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("nativeapp", "{culture}/nativeapp/{*path}");
        endpointRouteBuilder.MapClientBootstrapRoute("artificial-redirex-test-route", "redirex");

        MapNotFound(endpointRouteBuilder, "catchAllWithCulture", "{culture}/{*path}");
        MapNotFound(endpointRouteBuilder, "catchAll", "{*path}");

        void MapNotFound(IEndpointRouteBuilder builder, string name, string pattern)
        {
            object? constraints = null;

            if (pattern.Contains(RouteValueKeys.Culture, StringComparison.OrdinalIgnoreCase))
            {
                constraints = new
                {
                    culture = new CultureRouteConstraint(builder.ServiceProvider.GetRequiredService<ICultureUrlTokenResolver>()),
                };
            }

            builder.MapControllerRoute(
                    name: name,
                    pattern: pattern,
                    defaults: new
                    {
                        controller = nameof(PageNotFoundController).RemoveSuffix(nameof(Controller)),
                        action = nameof(PageNotFoundController.NotFound),
                    },
                    constraints: constraints)
                .ServesHtmlDocument()
                .Add(b => { b.Metadata.Add(new ServesNotFoundAttribute()); });
        }
    }
}
