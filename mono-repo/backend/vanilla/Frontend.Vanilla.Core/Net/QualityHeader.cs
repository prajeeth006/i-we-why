using System.Collections.Generic;
using System.Net.Http;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.Net;

internal static class QualityHeader
{
    /// <summary>
    /// Parses header which specifies multiple values with their qualities.
    /// </summary>
    public static IEnumerable<string> Parse(string? value)
    {
        if (value.IsNullOrWhiteSpace())
            yield break;

        var req = new HttpRequestMessage();
        req.Headers.AcceptEncoding.ParseAdd(value);

        foreach (var entry in req.Headers.AcceptEncoding)
            yield return entry.Value;
    }
}
