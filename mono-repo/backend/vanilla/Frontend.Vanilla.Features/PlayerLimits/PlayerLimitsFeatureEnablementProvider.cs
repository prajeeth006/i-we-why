using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.PlayerLimits;

internal sealed class PlayerLimitsFeatureEnablementProvider(IPlayerLimitsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.PlayerLimits;
    public string Source => $"{PlayerLimitsConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
