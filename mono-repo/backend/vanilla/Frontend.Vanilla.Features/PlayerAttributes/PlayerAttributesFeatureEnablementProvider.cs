using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.PlayerAttributes;

internal sealed class PlayerAttributesFeatureEnablementProvider(IPlayerAttributesConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.PlayerAttributes;
    public string Source => $"{PlayerAttributesConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
