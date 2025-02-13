using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.CookieConsent;

internal sealed class CookieConsentFeatureEnablementProvider(ICookieConsentConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.CookieConsent;
    public string Source => $"{CookieConsentConfiguration.FeatureName}.{nameof(config.Condition)}";
    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.Condition.EvaluateForClientAsync(cancellationToken);
}
