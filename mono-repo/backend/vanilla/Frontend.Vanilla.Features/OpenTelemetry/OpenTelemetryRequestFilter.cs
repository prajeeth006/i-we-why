using System.Collections.Generic;
using System.Net.Http;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.OpenTelemetry;

internal class OpenTelemetryRequestFilter(IOpenTelemetryConfiguration openTelemetryConfiguration)
{
    public bool ShouldInstrument(HttpContext httpContext)
        => ShouldInstrumentInternal(httpContext.Request.Path.ToString().ToLower(),
            openTelemetryConfiguration.AllowedPathsIncoming.Values);

    private bool ShouldInstrumentInternal(string path, IEnumerable<Regex> allowedPaths)
    {
        foreach (var regex in allowedPaths)
        {
            if (regex.IsMatch(path))
            {
                return true;
            }
        }

        return false;
    }
}
