using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Content.Model;

/// <summary>
/// Content system configuration.
/// </summary>
internal interface IContentConfiguration
{
    /// <summary>
    /// Gets the timespan that indicates the network timeout for the service HTTP requests.
    /// </summary>
    TimeSpan RequestTimeout { get; }

    /// <summary>
    /// Gets the path of the root node (usually label-specific) used as a base for relative paths specified in the code.
    /// </summary>
    string RootNodePath { get; }

    /// <summary>
    /// Gets the stripped paths.
    /// </summary>
    IReadOnlyList<string> StrippedPaths { get; }

    /// <summary>
    /// Gets the paths within Sitecore template repository to load template metadata corresponding to current generated template classes.
    /// </summary>
    IReadOnlyList<string> TemplatePaths { get; }

    /// <summary>
    /// Gets the host URL of Sitecore REST service.
    /// </summary>
    HttpUri Host { get; }

    /// <summary>
    /// Gets the CMS preview host.
    /// </summary>
    HttpUri PreviewHost { get; }

    /// <summary>
    /// Gets the template for EditorUrl that points back to the Sitecore Content Editor.
    /// </summary>
    /// <value>A valid editor url template.</value>
    /// <remarks>
    /// Makes only sense if connected to the CMS via source "Service" and if the application runs in debug mode.
    /// </remarks>
    /// <example>
    /// The template must contain format placeholders as follows
    /// e.g. http://CMSServerHost/sitecore/shell/Applications/Content%20Editor.aspx?fo={0}&#38;la={1}&#38;vs={2}.
    /// <list type="table">
    /// <listheader>
    /// <term>Placeholder</term>
    /// <description>Replaced By</description>
    /// </listheader>
    /// <item>
    /// <term>{0}</term>
    /// <description>CMS item id</description>
    /// </item>
    /// <item>
    /// <term>{1}</term>
    /// <description>Current culture two letter iso code</description>
    /// </item>
    /// <item>
    /// <term>{2}</term>
    /// <description>Version of the content item</description>
    /// </item>
    /// </list>
    /// </example>
    string EditorUrlTemplate { get; }

    /// <summary>
    /// Gets the version of the Content Service to use. It's appended to the Host URL when making a request.
    /// </summary>
    string Version { get; }

    /// <summary>
    /// Indicates whether content preview should be always enabled hence the content will be fetched from Sitecore even if it's not in final workflow state.
    /// </summary>
    bool ForcePreview { get; }

    /// <summary>
    /// The value specifying which environment will be targeted when fetching content from Sitecore.
    /// </summary>
    string Environment { get; }

    /// <summary>
    /// Gets content cache times for different retrieval scenarios.
    /// </summary>
    IContentCacheTimes CacheTimes { get; }

    bool ItemPathDisplayModeEnabled { get; }
    IReadOnlyDictionary<string, IReadOnlyList<string>> ItemPathDisplayModeMapping { get; }
}

/// <summary>
/// Configures content cache times for different retrieval scenarios.
/// </summary>
internal interface IContentCacheTimes
{
    /// <summary>
    /// Gets default cache time.
    /// </summary>
    TimeSpan Default { get; }

    /// <summary>
    /// Gets the cache time for not-found content.
    /// </summary>
    TimeSpan NotFoundContent { get; }

    /// <summary>
    /// Gets the time for caching stale content which is served in case of outage of Sitecore service.
    /// After it expires then access to the service is retried.
    /// </summary>
    TimeSpan SitecoreOutage { get; }
}

internal sealed class ContentConfiguration : IContentConfiguration
{
    public const string FeatureName = "VanillaFramework.Services.Content";

    public TimeSpan RequestTimeout { get; }
    public string RootNodePath { get; }
    public IReadOnlyList<string> StrippedPaths { get; }
    public IReadOnlyList<string> TemplatePaths { get; }
    public HttpUri Host { get; }
    public HttpUri PreviewHost { get; }
    public string EditorUrlTemplate { get; }
    public string Version { get; }
    public bool ForcePreview { get; }
    public string Environment { get; }
    public IReadOnlyList<string> KnownEnvironmentHostPrefixes { get; }
    public IContentCacheTimes CacheTimes { get; }
    public bool ItemPathDisplayModeEnabled { get; }
    public IReadOnlyDictionary<string, IReadOnlyList<string>> ItemPathDisplayModeMapping { get; }

    internal ContentConfiguration(ContentConfigurationBuilder builder)
    {
        builder.Validate();

        RequestTimeout = builder.RequestTimeout;
        RootNodePath = builder.RootNodePath;
        StrippedPaths = builder.StrippedPaths.ToArray().AsReadOnly();
        TemplatePaths = builder.TemplatePaths.ToArray().AsReadOnly();
        Host = new HttpUri(builder.Host);
        PreviewHost = builder.BuildPreviewHost();
        EditorUrlTemplate = builder.EditorUrlTemplate;
        Version = builder.Version;
        ForcePreview = builder.ForcePreview;
        Environment = builder.Environment;
        KnownEnvironmentHostPrefixes = builder.KnownEnvironmentHostPrefixes;
        CacheTimes = new ContentCacheTimes
        {
            Default = builder.CacheTimes.Default,
            NotFoundContent = builder.CacheTimes.NotFoundContent,
            SitecoreOutage = builder.CacheTimes.SitecoreOutage,
        };
        ItemPathDisplayModeEnabled = builder.ItemPathDisplayModeEnabled;
        ItemPathDisplayModeMapping = builder.ItemPathDisplayModeMapping;
    }
}
