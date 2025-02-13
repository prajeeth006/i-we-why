using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Offers;

internal sealed class OffersFeatureEnablementProvider(IOffersConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Offers;
    public string Source => $"{OffersConfiguration.FeatureName}.{nameof(config.OffersCountEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.OffersCountEnabled));
}
