using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.RedirectMessage;

internal sealed class RedirectMessageFeatureEnablementProvider(IRedirectMessageConfiguration config, ILogger<RedirectMessageFeatureEnablementProvider> log)
    : IFeatureEnablementProvider
{
    public string Id => FeatureIds.RedirectMessage;
    public string Source => $"{RedirectMessageConfiguration.FeatureName}.{nameof(config.IsEnabled)}&&{nameof(config.Rules)}";

    public async Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken)
    {
        if (config.IsEnabled)
        {
            foreach (var redirect in config.Rules)
            {
                if (await redirect.TryAsync(c => c.Condition.EvaluateAsync(cancellationToken), log))
                {
                    return ClientEvaluationResult<bool>.FromValue(true);
                }
            }
        }

        return ClientEvaluationResult<bool>.FromValue(false);
    }
}
