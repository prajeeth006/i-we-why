using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Frontend.Host.Features.StaticFiles;

internal static class StaticFilesHttpResponseExtensions
{
    public static void AddStaticFilesResponseHeaders(this HttpContext context,
        IStaticFilesConfiguration staticFilesConfiguration)
    {
        context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=31536000";

        if (context.Request.Headers.TryGetValue(HeaderNames.Origin, out var originHeaderValue) &&
            Uri.TryCreate(originHeaderValue, UriKind.Absolute, out var originUri) &&
            staticFilesConfiguration.WhiteListedHosts.Contains(originUri.Host))
        {
            context.Response.Headers[HeaderNames.AccessControlAllowOrigin] =
                $"{originUri.Scheme}://{originUri.Host}";
        }

        var pathMatch = staticFilesConfiguration.Headers.FirstOrDefault(kvp => context.Request.Path.Value!.Contains(kvp.Key));
        if (!pathMatch.Key.IsNullOrEmpty())
        {
            foreach (var header in pathMatch.Value)
            {
                context.Response.Headers.Append(header.Key, header.Value);
            }
        }
    }
}
