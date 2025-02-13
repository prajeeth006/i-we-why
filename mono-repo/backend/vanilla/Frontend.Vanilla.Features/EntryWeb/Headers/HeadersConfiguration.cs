using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.EntryWeb.Headers;

internal interface IHeadersConfiguration
{
    IReadOnlyDictionary<string, HeaderConfig> Response { get; }
    IDictionary<string, string> ClientResponseCacheControl { get; }
    IDictionary<string, IDictionary<string, string>> DynamicEarlyHintsFromManifest { get; }
}

internal sealed class HeadersConfiguration(
    IReadOnlyDictionary<string, HeaderConfig> response,
    IDictionary<string, string> clientResponseCacheControl,
    IDictionary<string, IDictionary<string, string>> dynamicEarlyHintsFromManifest,
    IDictionary<string, IDictionary<string, string>> staticFileResponse)
    : IHeadersConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Headers";

    public IReadOnlyDictionary<string, HeaderConfig> Response { get; } = response;
    public IDictionary<string, string> ClientResponseCacheControl { get; } = clientResponseCacheControl;
    public IDictionary<string, IDictionary<string, string>> DynamicEarlyHintsFromManifest { get; } = dynamicEarlyHintsFromManifest;
    public IDictionary<string, IDictionary<string, string>> StaticFileResponse { get; } = staticFileResponse;
}

internal sealed class HeaderConfig(bool enabledOnlyForDocumentRequest, string value, IDslExpression<bool> enabled)
{
    public bool EnabledOnlyForDocumentRequest { get; } = enabledOnlyForDocumentRequest;
    public string Value { get; } = value;
    public IDslExpression<bool> Enabled { get; } = enabled;
}
