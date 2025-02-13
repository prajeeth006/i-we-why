using System;
using System.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;

internal static class DiagnosticApiControllerHelper
{
    public static MessageDto CreateBadRequest(this HttpContext httpContext, Exception exception, string? message = null)
    {
        var fullMessage = (message != null ? message + " " : string.Empty) + exception.GetMessageIncludingInner();

        return httpContext.CreateBadRequest(fullMessage);
    }

    public static MessageDto CreateBadRequest(this HttpContext httpContext, string message)
    {
        httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

        return new MessageDto(message);
    }
}
