using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.ActivityPopup;

internal sealed class ActivityPopupFeatureEnablementProvider(IActivityPopupConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.ActivityPopup;
    public string Source => $"{ActivityPopupConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";
    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
