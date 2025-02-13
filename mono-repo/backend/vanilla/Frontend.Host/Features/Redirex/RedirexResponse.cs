namespace Frontend.Host.Features.Redirex;

internal sealed class RedirexResponse
{
    public bool IsRedirect { get; set; }

    public bool IsTemporary { get; set; }

    public string? Url { get; set; }

    public List<KeyValuePair<string, string[]>> HttpHeaders { get; set; } = new (); // Not using StringValues here because default JsonConverter does not serialize it.
}
