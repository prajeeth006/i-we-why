using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.LabelSwitcher;

internal sealed class LabelSwitcherFeatureEnablementProvider(ILabelSwitcherConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.LabelSwitcher;
    public string Source => $"{LabelSwitcherConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
