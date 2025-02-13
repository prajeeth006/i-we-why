using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Content.Model;

/// <summary>
/// The builder of <see cref="IContentConfiguration" />.
/// </summary>
public sealed class ContentConfigurationBuilder : IConfigurationBuilder<IContentConfiguration>, IValidatableObject
{
    /// <summary>
    /// See <see cref="IContentConfiguration.RequestTimeout" />.
    /// Default: 100 seconds.
    /// </summary>
    [MinimumTimeSpan("00:00:00.1")]
    public TimeSpan RequestTimeout { get; set; } = TimeSpan.FromSeconds(100);

    /// <summary>
    /// See <see cref="IContentConfiguration.RootNodePath" />.
    /// Default: /.
    /// </summary>
    [RequiredString]
    public string RootNodePath { get; set; } = "/";

    /// <summary>
    /// See <see cref="IContentConfiguration.StrippedPaths" />.
    /// </summary>
    [Required, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyList<string> StrippedPaths { get; set; } = new string[] { };

    /// <summary>
    /// See <see cref="IContentConfiguration.TemplatePaths" />.
    /// Default: ["/Vanilla"].
    /// </summary>
    [Required, RequiredItems, NotEmptyCollection, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyList<string> TemplatePaths { get; set; } = new[] { "/Vanilla" };

    /// <summary>
    /// See <see cref="IContentConfiguration.Host" />.
    /// Default: http://rest.cms.prod.env.works.
    /// </summary>
    [Required, HttpHostUrl]
    public Uri Host { get; set; } = new Uri("http://rest.cms.prod.env.works");

    /// <summary>
    /// See <see cref="ContentConfiguration.KnownEnvironmentHostPrefixes" />.
    /// Default: ["qa", "preview"].
    /// </summary>
    [Required, RequiredItems, NotEmptyCollection, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyList<string> KnownEnvironmentHostPrefixes { get; set; } = new[] { "qa", "preview" };

    /// <summary>
    /// See <see cref="IContentConfiguration.EditorUrlTemplate" />.
    /// Default: http://cms.bwin.prod/sitecore/shell/Applications/Content Editor.aspx?fo={0}&amp;la={1}&amp;vs={2}.
    /// </summary>
    [RequiredString]
    public string EditorUrlTemplate { get; set; } = "http://cms.bwin.prod/sitecore/shell/Applications/Content Editor.aspx?fo={0}&la={1}&vs={2}";

    /// <summary>
    /// See <see cref="IContentConfiguration.Version" />.
    /// Default: V5.
    /// </summary>
    [RequiredString]
    [RegularExpression(@"^V([1-9]\d+|[5-9])$", ErrorMessage = "{0} must be 'V5' or higher.")]
    public string Version { get; set; } = "V5";

    /// <summary>
    /// See <see cref="IContentConfiguration.ForcePreview" />.
    /// Default: false.
    /// </summary>
    public bool ForcePreview { get; set; }

    /// <summary>
    /// See <see cref="IContentConfiguration.Environment" />.
    /// Default: prod.
    /// </summary>
    [RequiredString]
    public string Environment { get; set; } = "prod";

    /// <summary>
    /// See <see cref="IContentConfiguration.CacheTimes" />.
    /// Default: a new instance.
    /// </summary>
    [Required]
    public ContentCacheTimes CacheTimes { get; set; } = new ContentCacheTimes();

    /// <summary>
    /// Indicates if item's path value will be used instead original field value. Actual template and field mappings are specified in ItemPathDisplayModeMapping.
    /// </summary>
    public bool ItemPathDisplayModeEnabled { get; set; }

    /// <summary>
    /// Indicates configured templates and it's fields which values will be replaced with item's path when ItemPathDisplayModeEnabled is set.
    /// </summary>
    public IReadOnlyDictionary<string, IReadOnlyList<string>> ItemPathDisplayModeMapping { get; set; }

    IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
    {
        if (RootNodePath[0] != '/')
            yield return new ValidationResult($"RootNodePath must start with a slash '/' but there is '{RootNodePath}'.", new[] { nameof(RootNodePath) });

        foreach (var path in TemplatePaths.Where(p => !p.StartsWith("/") || (p.Length > 1 && p.EndsWith("/"))))
            yield return new ValidationResult($"TemplatePaths must start with a slash '/' and not end with it but there is '{path}'.", new[] { nameof(TemplatePaths) });
    }

    IContentConfiguration IConfigurationBuilder<IContentConfiguration>.Build() => Build();
    internal IContentConfiguration Build() => new ContentConfiguration(this);

    internal HttpUri BuildPreviewHost()
    {
        var builder = new UriBuilder(Host);

        var prefix = KnownEnvironmentHostPrefixes.FirstOrDefault(p => Host.Host.StartsWith($"{p}.", StringComparison.OrdinalIgnoreCase));
        builder.Host = "preview." + (prefix != null ? Host.Host.RemovePrefix(prefix + ".") : Host.Host);

        return builder.GetHttpUri();
    }
}

/// <summary>
/// See <see cref="IContentCacheTimes" />.
/// </summary>
public sealed class ContentCacheTimes : IContentCacheTimes
{
    /// <summary>
    /// See <see cref="IContentCacheTimes.Default" />.
    /// Default: 15 minutes.
    /// </summary>
    public TimeSpan Default { get; set; } = TimeSpan.FromMinutes(10);

    /// <summary>
    /// See <see cref="IContentCacheTimes.NotFoundContent" />.
    /// Default: 2 minutes.
    /// </summary>
    public TimeSpan NotFoundContent { get; set; } = TimeSpan.FromMinutes(2);

    /// <summary>
    /// See <see cref="IContentCacheTimes.SitecoreOutage" />.
    /// Default: 2 minutes.
    /// </summary>
    public TimeSpan SitecoreOutage { get; set; } = TimeSpan.FromMinutes(2);
}
