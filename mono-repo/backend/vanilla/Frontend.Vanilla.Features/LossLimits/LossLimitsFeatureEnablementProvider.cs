using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.LossLimits;

internal sealed class LossLimitsFeatureEnablementProvider(ILossLimitsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.LossLimits;
    public string Source => $"{LossLimitsConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
