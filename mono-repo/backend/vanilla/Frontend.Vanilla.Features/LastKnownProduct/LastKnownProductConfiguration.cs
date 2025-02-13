using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.LastKnownProduct;

internal interface ILastKnownProductConfiguration
{
    IDslExpression<bool> Enabled { get; }
}

internal sealed class LastKnownProductConfiguration(IDslExpression<bool> enabled) : ILastKnownProductConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LastKnownProduct";

    public IDslExpression<bool> Enabled { get; set; } = enabled;
}
