using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.DebounceButtons;

internal sealed class DebounceButtonsFeatureEnablementProvider(IDebounceButtonsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.DebounceButtons;
    public string Source => $"{DebounceButtonsConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
