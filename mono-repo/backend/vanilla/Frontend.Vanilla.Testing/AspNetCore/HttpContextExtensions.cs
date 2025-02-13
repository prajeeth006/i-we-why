using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Moq;

namespace Frontend.Vanilla.Testing.AspNetCore;

internal static class HttpContextExtensions
{
    public static void SetResponseHasStarted(this HttpContext httpContext, bool value = true)
    {
        var existing = httpContext.Features.Get<IHttpResponseFeature>() ?? throw new Exception("No response feature.");
        httpContext.Features.Set(Mock.Of<IHttpResponseFeature>(f =>
            f.StatusCode == existing.StatusCode
            && f.ReasonPhrase == existing.ReasonPhrase
#pragma warning disable CS0618 // Type or member is obsolete
            && f.Body == existing.Body
#pragma warning restore CS0618 // Type or member is obsolete
            && f.Headers == existing.Headers
            && f.HasStarted == value));
    }
}
