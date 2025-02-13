using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.RememberMeLogoutPrompt;

internal sealed class RememberMeLogoutPromptFeatureEnablementProvider(IRememberMeLogoutPromptConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.RememberMeLogoutPrompt;
    public string Source => $"{RememberMeLogoutPromptConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
