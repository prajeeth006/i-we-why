using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.BottomNav;

internal sealed class BottomNavFeatureEnablementProvider(IBottomNavConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.BottomNav;
    public string Source => $"{BottomNavConfiguration.FeatureName}.{nameof(config.IsEnabled)}";
    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) => config.IsEnabled.EvaluateForClientAsync(cancellationToken);
}
