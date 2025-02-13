using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.LoginDuration;

internal sealed class LoginDurationFeatureEnablementProvider(ILoginDurationConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.LoginDuration;
    public string Source => $"{LoginDurationConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
