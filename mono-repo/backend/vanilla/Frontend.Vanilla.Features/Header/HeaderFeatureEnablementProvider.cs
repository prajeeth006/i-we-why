using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Header;

internal sealed class HeaderFeatureEnablementProvider(IHeaderConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Header;
    public string Source => $"{HeaderConfiguration.FeatureName}.{nameof(config.Enabled)}";
    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.Enabled.EvaluateForClientAsync(cancellationToken);
}
