using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Configures behavior of the content infrastructure when loading the content.
/// </summary>
public struct ContentLoadOptions
{
    internal const string Disclaimer = "This rule is specified by developers of related feature using Vanilla API" +
                                       $" e.g. {nameof(IContentService)}, {nameof(ContentLoadOptions)} etc. Therefore ask them (you?) for explanation.";

    /// <summary>
    /// Indicates how many levels below the current item should be prefetched so that they are cached usually for subsequent retrieval.
    /// </summary>
    public uint PrefetchDepth { get; set; }

    /// <summary>
    /// Indicates if language translation is required. Then untranslated content is treated as an <see cref="DocumentStatus.Invalid" />.
    /// </summary>
    public bool RequireTranslation { get; set; }

    /// <summary>
    /// Indicates if language translation should be included. Then untranslated content is treated as an <see cref="DocumentStatus.NotFound" />.
    /// </summary>
    public bool IncludeTranslation { get; set; }

    private DslEvaluation dslEvaluation;

    /// <summary>
    /// Specifies how Vanilla DSL should be evaluated when content is loaded. Currently this applies to filter condition and placeholders.
    /// </summary>
    public DslEvaluation DslEvaluation
    {
        get => dslEvaluation;
        set => dslEvaluation = Guard.DefinedEnum(value, nameof(value));
    }

    /// <summary>
    /// Indicates if heckaton cache will be skipped and content will be directly served from CMS system. />.
    /// </summary>
    public bool BypassCache { get; set; }

    /// <summary>
    /// Add revision value to the request. This will force skipping network level caches as creates new url. />.
    /// </summary>
    public string Revision { get; set; }

    /// <summary>
    /// Indicates if caching of children retrieved from parent when using PrefetchDepth should be skipped. If children are retrieved only from parent request it's better to set this to true as children cached requests would never be used.
    /// </summary>
    public bool BypassChildrenCache { get; set; }

    /// <summary>
    /// Used only for GetChildrenAsync.
    /// Indicates if Prefetched content retrieved with PrefetchDepth should be processed by any <see cref="IJustInTimeContentProcessor" />. If set to true no processor will run on the prefetched items.
    /// </summary>
    public bool BypassPrefetchedProcessing { get; set; }

    /// <summary>See <see cref="M:System.Object.ToString" />.</summary>
    public override string ToString()
        =>
            $"DslEvaluation = {DslEvaluation}; PrefetchDepth = {PrefetchDepth}; RequireTranslation = {RequireTranslation}; BypassCache = {BypassCache}; Revision = {Revision}";

    /// <summary>
    /// Creates a <see cref="ContentLoadOptions" /> from given <paramref name="dslEvaluation" />.
    /// </summary>
    public static implicit operator ContentLoadOptions(DslEvaluation dslEvaluation)
        => new ContentLoadOptions { DslEvaluation = dslEvaluation };
}

/// <summary>
/// Specifies how Vanilla DSL should be evaluated when content is loaded.
/// Currently this applies to filter condition and placeholders.
/// </summary>
public enum DslEvaluation
{
    /// <summary>
    /// DSL is fully evaluated on the server.
    /// </summary>
    FullOnServer = 0,

    /// <summary>
    /// DSL is partially evaluated on the server and additional expression is returned in corresponding fields to be evaluated on the client.
    /// </summary>
    PartialForClient = 1,
}
