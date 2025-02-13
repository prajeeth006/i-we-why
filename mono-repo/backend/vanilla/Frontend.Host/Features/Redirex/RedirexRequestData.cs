using Microsoft.Extensions.Primitives;

namespace Frontend.Host.Features.Redirex;

internal sealed class RedirexRequestData
{
    public string Url { get; set; } = "";

    public string IPAddress { get; set; } = "";

    public string UserAgent { get; set; } = "";

    public List<KeyValuePair<string, StringValues>> HttpHeaders { get; set; } = new ();

    public bool IgnoreGlobalHttpsRedirect { get; set; }

    public bool ForceUsageOfDisabledRepository { get; set; }

    public bool SSLOffloadingMode { get; set; }
}
