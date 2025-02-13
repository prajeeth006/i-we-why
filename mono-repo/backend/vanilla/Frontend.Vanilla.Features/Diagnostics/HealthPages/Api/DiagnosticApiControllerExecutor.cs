using System;
using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;

/// <summary>
/// Common logic for diagnostic API controllers.
/// </summary>
internal interface IDiagnosticApiControllerExecutor
{
    Task ExecuteAsync(IDiagnosticApiController controller);
}

internal sealed class DiagnosticApiControllerExecutor(IHttpContextAccessor httpContextAccessor, IInternalRequestEvaluator internalRequestEvaluator)
    : IDiagnosticApiControllerExecutor
{
    public async Task ExecuteAsync(IDiagnosticApiController controller)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();

        if (!internalRequestEvaluator.IsInternal())
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
            await WriteJsonAsync(new MessageDto(AllowOnlyInternalAccessMiddleware.PublicInternetMessage));

            return;
        }

        try
        {
            var data = await controller.ExecuteAsync(httpContext);
            if (data != null) await WriteJsonAsync(data);
        }
        catch (Exception ex)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await WriteJsonAsync(new MessageDto(ex.GetMessageIncludingInner()));
        }

        ValueTask WriteJsonAsync(object data)
        {
            var bytes = DiagnosticJsonSerializer.ToBytes(data);
            httpContext.Response.ContentType = ContentTypes.Json;

            return httpContext.Response.Body.WriteAsync(bytes, httpContext.RequestAborted);
        }
    }
}
