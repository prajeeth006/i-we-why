using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.DepositLimits;

internal sealed class DepositLimitExceededFeatureEnablementProvider(IDepositLimitsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.DepositLimitExceeded;
    public string Source => $"{DepositLimitsConfiguration.FeatureName}.{nameof(config.EnableDepositLimitExceededOverlay)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.EnableDepositLimitExceededOverlay));
}
