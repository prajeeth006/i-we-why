using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Inactive;

internal sealed class InactiveFeatureEnablementProvider(IInactiveConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Inactive;
    public string Source => $"{InactiveConfiguration.FeatureName}.{nameof(config.ShowToast)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.ShowToast));
}
