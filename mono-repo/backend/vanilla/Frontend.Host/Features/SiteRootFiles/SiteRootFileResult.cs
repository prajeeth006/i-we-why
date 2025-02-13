namespace Frontend.Host.Features.SiteRootFiles;

internal sealed class SiteRootFileResult
{
    public TimeSpan CacheTime { get; }
    public string? Content { get; }
    public string ContentType { get; }

    internal SiteRootFileResult(string contentType, TimeSpan cacheTime, string? content)
    {
        ContentType = contentType;
        CacheTime = cacheTime;
        Content = content;
    }
}
