using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.SingleSignOn;

internal sealed class SingleSignOnFeatureEnablementProvider(IAuthenticationConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.SingleSignOn;
    public string Source => $"{AuthenticationConfiguration.FeatureName}.{nameof(config.SingleSignOnLabels)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.SingleSignOnLabels.Any()));
}
