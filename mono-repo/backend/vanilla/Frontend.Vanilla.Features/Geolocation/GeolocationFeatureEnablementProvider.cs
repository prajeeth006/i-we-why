using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Geolocation.Config;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Geolocation;

internal sealed class GeolocationFeatureEnablementProvider(IGeolocationConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Geolocation;
    public string Source => $"{GeolocationConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
