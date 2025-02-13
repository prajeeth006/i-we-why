namespace Frontend.Host.Features.Index;

public enum IndexHtmlMode
{
    /// <summary>html served via index.cshtml razor view.</summary>
    RazorIndexView = 1,

    /// <summary>html served by merge of angular cli generated index.html and placeholder replacers.</summary>
    AngularCliGeneratedIndexHtml = 2,
}

internal interface IIndexHtmlConfiguration
{
    IndexHtmlMode Mode { get; }
}

internal sealed class IndexHtmlHtmlConfiguration : IIndexHtmlConfiguration
{
    public const string FeatureName = "Host.Features.IndexHtml";

    public IndexHtmlMode Mode { get; set; }
}
