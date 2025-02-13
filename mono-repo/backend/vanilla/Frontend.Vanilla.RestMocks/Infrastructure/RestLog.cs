using System;
using System.Diagnostics;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.RestMocks.Infrastructure;

internal static class RestLog
{
    public static readonly TemporaryBuffer<RestLogEntry> Entries = new (size: 200);
    private static readonly string ThisAssemblyNamespace = typeof(RestLog).Namespace ?? throw new Exception();

    public static void Add(HttpContext httpContext, RestRequest request, RestResponse mockedResponse, string correlationId)
        => Entries.Add(new RestLogEntry
        {
            Info = new RestInfoLogEntry
            {
                Time = DateTimeOffset.UtcNow,
                CorrelationId = correlationId,
                WebRequestUrl = httpContext?.Request.GetFullUrl(),
                VanillaStackTrace = new StackTrace()
                    .GetFrames().NullToEmpty()
                    .Select(f => f.GetMethod())
                    .Where(m => m.DeclaringType?.Namespace is string n && n.StartsWith("Bwin.") && !n.StartsWith(ThisAssemblyNamespace))
                    .Select(m => $"{m.DeclaringType.ToString().RemovePrefix("Frontend.Vanilla.")}.{m.Name}")
                    .ToList(),
            },
            Request = new RestRequestLogEntry
            {
                Url = request.Url,
                Method = request.Method.ToString().ToUpper(),
                Headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToList()),
                Content = request.Content?.Bytes.DecodeToString(),
            },
            Response = mockedResponse != null
                ? new RestResponseLogEntry
                {
                    StatusCode = mockedResponse.StatusCode,
                }
                : null,
        });
}
