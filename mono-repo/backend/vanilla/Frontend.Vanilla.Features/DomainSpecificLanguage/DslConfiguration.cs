using System.Collections.Generic;

namespace Frontend.Vanilla.Features.DomainSpecificLanguage;

/// <summary>
/// Configuration of domain specific actions executed globally.
/// </summary>
internal interface IDslConfiguration
{
    IReadOnlyDictionary<string, object> DefaultValuesUnregisteredProvider { get; }
}

internal sealed class DslConfiguration(IReadOnlyDictionary<string, object> defaultValuesUnregisteredProvider) : IDslConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DomainSpecificLanguage";

    public IReadOnlyDictionary<string, object> DefaultValuesUnregisteredProvider { get; } = defaultValuesUnregisteredProvider;
}
