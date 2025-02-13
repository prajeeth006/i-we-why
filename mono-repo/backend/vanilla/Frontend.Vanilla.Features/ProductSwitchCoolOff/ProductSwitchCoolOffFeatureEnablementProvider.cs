using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.ProductSwitchCoolOff;

internal sealed class ProductSwitchCoolOffFeatureEnablementProvider(IProductSwitchCoolOffConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.ProductSwitchCoolOff;
    public string Source => $"{ProductSwitchCoolOffConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
