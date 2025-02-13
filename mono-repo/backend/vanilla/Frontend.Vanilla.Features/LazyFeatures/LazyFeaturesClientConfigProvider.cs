using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LazyFeatures;

internal class LazyFeaturesClientConfigProvider(
    ILazyFeaturesConfiguration configuration,
    IEnumerable<IFeatureEnablementProvider> registeredProviders,
    IInternalRequestEvaluator internalRequestEvaluator)
    : LambdaClientConfigProvider("vnLazyFeatures", async ct =>
    {
        var strategies = new Dictionary<string, EvaluatedOptions>();

        foreach (var item in configuration.Strategies)
        {
            var enabled = await item.Value.Rule.EvaluateForClientAsync(ct);
            var value = new EvaluatedOptions(enabled, $"{nameof(LazyFeaturesConfiguration.Strategies)}", strategy: item.Key, delay: item.Value.Delay);
            strategies.Add(item.Key, value);
        }

        var providers = registeredProviders.ToArray();
        var rules = new Dictionary<string, EvaluatedOptions>();

        foreach (var item in configuration.Rules)
        {
            var itemStrategy = item.Value.Strategy ?? configuration.DefaultStrategy;
            var strategyEvaluatedOptions = strategies[itemStrategy];
            var enablementInfo = await GetEnablementInfoAsync(providers, item, strategyEvaluatedOptions, ct);
            var options = new EvaluatedOptions(
                enablementInfo.Item1,
                internalRequestEvaluator.IsInternal() ? enablementInfo.Item2 : null,
                item.Value.Id,
                itemStrategy,
                item.Value.Styles,
                item.Value.Delay ?? strategyEvaluatedOptions.Delay,
                item.Value.Events);
            rules.Add(item.Key, options);
        }

        return new
        {
            rules,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    private static async Task<(ClientEvaluationResult<bool>, string?)> GetEnablementInfoAsync(
        IFeatureEnablementProvider[] providers,
        KeyValuePair<string, FeatureOptions> item,
        EvaluatedOptions strategyEvaluatedOptions,
        CancellationToken ct)
    {
        var provider = providers.FirstOrDefault(p => p.Id == item.Key);

        if (provider != null)
        {
            var enabled = await provider.IsEnabledAsync(ct);

            return (enabled, provider.Source);
        }

        if (item.Value.Rule == null) return (strategyEvaluatedOptions.Enabled, strategyEvaluatedOptions.EnabledSource);

        var ruleEnabled = await item.Value.Rule.EvaluateForClientAsync(ct);

        return (ruleEnabled, $"{nameof(LazyFeaturesConfiguration.Rules)}");
    }
}
