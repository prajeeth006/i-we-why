using System;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Resolves instance of a config for current context (HttpRequest).
/// </summary>
internal interface ICurrentConfigurationResolver
{
    object Resolve(TrimmedRequiredString featureName, bool removeSensitiveData = false);
}

internal sealed class CurrentConfigurationResolver(
    ICurrentContextAccessor currentContextAccessor,
    ICurrentChangesetResolver currentChangesetResolver,
    IDynamicVariationContextResolver varContextResolver)
    : ICurrentConfigurationResolver
{
    public object Resolve(TrimmedRequiredString featureName, bool removeSensitiveData = false)
        // Once associated with the context then it can't change to keep the execution consistent!
        => removeSensitiveData
            ? ResolveFresh(featureName, true)
            : currentContextAccessor.Items.GetOrAddFromFactory("Van:Config:Instance:" + featureName.Value.ToLowerInvariant(),
                _ => ResolveFresh(featureName));

    private object ResolveFresh(TrimmedRequiredString featureName, bool removeSensitiveData = false)
    {
        var changeset = currentChangesetResolver.Resolve();

        if (removeSensitiveData && HasSensitiveData(changeset, featureName))
        {
            return "Value removed due to sensitive data";
        }

        // First config with all required properties matched (contained according to hierarchy)
        var configs = changeset.Features[featureName];
        var config = ResolveConfig(configs, p => varContextResolver.Resolve(p, changeset));

        return config.Instance;
    }

    public static FeatureConfiguration ResolveConfig(FeatureConfigurationList featureConfigs, Func<TrimmedRequiredString, TrimmedRequiredString> getContextProperty)
        => featureConfigs.First(c => c.Context.Properties.All(p =>
        {
            var value = getContextProperty(p.Key);

            return p.Value.Contains(value);
        }));

    private static bool HasSensitiveData(IChangeset? changeset, TrimmedRequiredString featureName)
    {
        if (changeset == null || !changeset.Dto.Configuration.Any())
        {
            return false;
        }

        var featureConfig = changeset.Dto.Configuration.First(c => c.Key == featureName);

        return featureConfig.Value.Any(v => v.Value.CriticalityLevel == 1);
    }
}
