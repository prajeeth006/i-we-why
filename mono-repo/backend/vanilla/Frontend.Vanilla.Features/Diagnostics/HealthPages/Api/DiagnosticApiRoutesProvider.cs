using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;

internal interface IDiagnosticApiRoutesProvider
{
    IEnumerable<(string UrlPattern, string[] HttpMethods, Func<Task> ExecuteAsync)> GetRoutes();
}

internal sealed class DiagnosticApiRoutesProvider(IEnumerable<IDiagnosticApiController> controllers, IDiagnosticApiControllerExecutor executor)
    : IDiagnosticApiRoutesProvider
{
    private readonly IReadOnlyList<IDiagnosticApiController> controllers = controllers.ToList();

    public IEnumerable<(string UrlPattern, string[] HttpMethods, Func<Task> ExecuteAsync)> GetRoutes()
    {
        foreach (var controller in controllers)
        {
            var route = controller.GetRoute();
            var httpMethods = new[] { route.HttpMethod.Method.ToUpper() };
            var executeAsync = new Func<Task>(() => executor.ExecuteAsync(controller));

            foreach (var urlPattern in MultiplyByOptionalParameters(route.UrlPattern))
                yield return (urlPattern, httpMethods, executeAsync);
        }
    }

    /// <summary>
    /// Optional parameters (trailing question mark) are not allowed on legacy ASP.NET.
    /// So instead of "/api/config/{feature?}/{key?}" this multiplies it to
    /// ["/api/config", "/api/config/{feature}", "/api/config/{feature}/{key}"].
    /// </summary>
    private static IEnumerable<string> MultiplyByOptionalParameters(string urlPattern)
    {
        if (urlPattern.EndsWith("?}"))
        {
            var segments = urlPattern.Split('/');

            foreach (var result in MultiplyByOptionalParameters(segments.Take(segments.Length - 1).Join("/")))
                yield return result;
        }

        yield return urlPattern.Replace("?}", "}");
    }
}
