using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.LivePerson;

internal sealed class LivePersonFeatureEnablementProvider(ILivePersonConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.LivePerson;
    public string Source => $"{LivePersonConfiguration.FeatureName}.{nameof(config.Enabled)}";
    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.Enabled.EvaluateForClientAsync(cancellationToken);
}
