using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.SessionLimits;

internal sealed class SessionLimitsFeatureEnablementProvider(ISessionLimitsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.SessionLimits;
    public string Source => $"{SessionLimitsConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
