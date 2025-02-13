using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Footer;

internal sealed class FooterFeatureEnablementProvider(IFooterConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Footer;
    public string Source => $"{FooterConfiguration.FeatureName}.{nameof(config.Enabled)}";
    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.Enabled.EvaluateForClientAsync(cancellationToken);
}
