using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;

internal interface IDiagnosticApiController
{
    DiagnosticsRoute GetRoute();
    Task<object?> ExecuteAsync(HttpContext httpContext);
}

internal abstract class SyncDiagnosticApiController : IDiagnosticApiController
{
    public Task<object?> ExecuteAsync(HttpContext httpContext)
        => Task.FromResult(Execute(httpContext));

    public abstract DiagnosticsRoute GetRoute();
    public abstract object? Execute(HttpContext httpContext);
}

internal sealed class DiagnosticsRoute(HttpMethod httpMethod, TrimmedRequiredString urlPattern)
{
    public HttpMethod HttpMethod { get; } = httpMethod;
    public TrimmedRequiredString UrlPattern { get; } = urlPattern;

    public static implicit operator DiagnosticsRoute(string urlPattern)
        => new (HttpMethod.Get, urlPattern);
}
