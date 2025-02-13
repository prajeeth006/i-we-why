using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Offline;

internal sealed class OfflineFeatureEnablementProvider(IOfflineConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Offline;
    public string Source => $"{OfflineConfiguration.FeatureName}.{nameof(config.IsOfflineOverlayEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsOfflineOverlayEnabled.EvaluateForClientAsync(cancellationToken);
}
