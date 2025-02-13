using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.SharedFeatures.Api.Features.DepositSession;

internal sealed class DepositSessionFeatureEnablementProvider(IDepositSessionConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.DepositSession;
    public string Source => $"{DepositSessionConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
