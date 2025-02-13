using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.PlayBreak;

internal sealed class PlayBreakFeatureEnablementProvider(IPlayBreakConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.PlayBreak;
    public string Source => $"{PlayBreakConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
