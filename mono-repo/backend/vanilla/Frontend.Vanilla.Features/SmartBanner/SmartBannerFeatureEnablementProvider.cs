using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.SmartBanner;

internal sealed class SmartBannerFeatureEnablementProvider(ISmartBannerConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.SmartBanner;
    public string Source => $"{SmartBannerConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.AppId.Equals("NoAppId")
        ? Task.FromResult(ClientEvaluationResult<bool>.FromValue(false))
        : config.IsEnabled.EvaluateForClientAsync(cancellationToken);
}
