using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.OfflinePage;

internal sealed class OfflinePageFeatureEnablementProvider(IOfflinePageConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.OfflinePage;
    public string Source => $"{OfflinePageConfiguration.FeatureName}.{nameof(config.PollEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.PollEnabled));
}
