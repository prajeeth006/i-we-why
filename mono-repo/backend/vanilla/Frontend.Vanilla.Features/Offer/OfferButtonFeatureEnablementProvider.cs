using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;
using Frontend.Vanilla.Features.Offers;

namespace Frontend.Vanilla.Features.Offer;

internal sealed class OfferButtonFeatureEnablementProvider(IOffersConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.OfferButton;
    public string Source => $"{OffersConfiguration.FeatureName}.{nameof(config.OfferButtonEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.OfferButtonEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
