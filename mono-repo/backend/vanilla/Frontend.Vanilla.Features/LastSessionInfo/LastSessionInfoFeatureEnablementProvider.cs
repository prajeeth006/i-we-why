using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.LastSessionInfo;

internal sealed class LastSessionInfoFeatureEnablementProvider(ILastSessionInfoConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.LastSessionInfo;
    public string Source => $"{LastSessionInfoConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
