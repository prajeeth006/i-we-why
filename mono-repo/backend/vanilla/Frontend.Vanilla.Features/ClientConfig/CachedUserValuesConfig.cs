using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.ClientConfig;

internal interface ICachedUserValuesConfig
{
    IDslExpression<bool> FetchCachedUserValuesCondition { get; }
}

internal class CachedUserValuesConfig(IDslExpression<bool> fetchCachedUserValuesCondition) : ICachedUserValuesConfig
{
    public const string FeatureName = "VanillaFramework.Features.CachedUserValuesConfiguration";

    public IDslExpression<bool> FetchCachedUserValuesCondition { get; set; } = fetchCachedUserValuesCondition;
}
