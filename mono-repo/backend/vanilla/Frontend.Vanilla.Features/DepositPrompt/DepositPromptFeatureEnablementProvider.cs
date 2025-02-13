using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.DepositPrompt;

internal sealed class DepositPromptFeatureEnablementProvider(IDepositPromptConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.DepositPrompt;
    public string Source => $"{DepositPromptConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
