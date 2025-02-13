using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.HomePage;

internal interface IHomePageConfiguration
{
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal sealed class HomePageConfiguration(IDslExpression<bool> isEnabledCondition) : IHomePageConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.HomePage";

    public IDslExpression<bool> IsEnabledCondition { get; set; } = isEnabledCondition;
}
