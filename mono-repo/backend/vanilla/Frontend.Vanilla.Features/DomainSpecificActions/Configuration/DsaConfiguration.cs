using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.DomainSpecificActions.Configuration;

/// <summary>
/// Configuration of domain specific actions executed globally.
/// </summary>
internal interface IDsaConfiguration
{
    IDslAction? HtmlDocumentServerDslAction { get; }
    IDslAction? HtmlDocumentClientDslAction { get; }
}

internal sealed class DsaConfiguration(IDslAction? htmlDocumentServerDslAction, IDslAction? htmlDocumentClientDslAction) : IDsaConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DomainSpecificActions";

    public IDslAction? HtmlDocumentServerDslAction { get; } = htmlDocumentServerDslAction;
    public IDslAction? HtmlDocumentClientDslAction { get; } = htmlDocumentClientDslAction;
}
