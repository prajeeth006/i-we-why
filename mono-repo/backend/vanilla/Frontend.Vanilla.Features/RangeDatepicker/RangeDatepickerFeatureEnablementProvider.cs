using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.RangeDatepicker;

internal sealed class RangeDatepickerFeatureEnablementProvider(IRangeDatepickerConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.RangeDatepicker;
    public string Source => $"{RangeDatepickerConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
