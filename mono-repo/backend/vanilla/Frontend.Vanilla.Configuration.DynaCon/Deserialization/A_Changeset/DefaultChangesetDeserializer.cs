using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;

/// <summary>
/// Main implementation of <see cref="IChangesetDeserializer" />.
/// </summary>
internal sealed class DefaultChangesetDeserializer : IChangesetDeserializer
{
    private readonly IReadOnlyList<IConfigurationInfo> configInfos;
    private readonly IFeatureDeserializer featureDeserializer;
    private readonly IConfigurationServiceUrls urls;

    public DefaultChangesetDeserializer(IEnumerable<IConfigurationInfo> configInfos, IFeatureDeserializer featureDeserializer, IConfigurationServiceUrls urls)
    {
        this.configInfos = configInfos.ToArray();
        this.featureDeserializer = featureDeserializer;
        this.urls = urls;

        this.configInfos.CheckNoDuplicatesBy(i => i.ServiceType);
        this.configInfos.CheckNoDuplicatesBy(i => i.FeatureName, RequiredStringComparer.OrdinalIgnoreCase);
    }

    public IValidChangeset Deserialize(ConfigurationResponse changesetDto, VariationHierarchyResponse contextHierarchy, ConfigurationSource source)
    {
        var url = urls.Changeset(changesetDto.ChangesetId);
        var allConfigs = new Dictionary<TrimmedRequiredString, FeatureConfigurationList>();
        var allErrors = new List<Exception>();
        var allWarnings = new List<TrimmedRequiredString>();
        var remainingFeatures = new HashSet<string>(changesetDto.Configuration.Keys, StringComparer.OrdinalIgnoreCase);

        foreach (var info in configInfos)
        {
            if (!changesetDto.Configuration.TryGetValue(info.FeatureName, out var configDto))
            {
                allErrors.Add(new FeatureDeserializationException(info.FeatureName, $"Missing feature '{info.FeatureName}' in the response from DynaCon."
                                                                                    + " Wasn't it deleted? Do you have corresponding DynaCon 'service' parameter with correct version specified in configuration engine settings?"));

                continue;
            }

            try
            {
                var (configs, warnings) = featureDeserializer.Deserialize(info, configDto, contextHierarchy);

                allConfigs.Add(info.FeatureName, new FeatureConfigurationList(configs));
                allWarnings.AddRange(warnings.Select(w => new TrimmedRequiredString($"Feature '{info.FeatureName}': {w}")));
                remainingFeatures.Remove(info.FeatureName);
            }
            catch (Exception ex)
            {
                allErrors.Add(new FeatureDeserializationException(info.FeatureName, $"Failed deserializing {info}", ex));
            }
        }

        if (allErrors.Count > 0)
        {
            var changeset = new FailedChangeset(changesetDto, contextHierarchy, source, url, allErrors);

            throw new ChangesetDeserializationException($"Failed deserializing changeset {changesetDto.ChangesetId}.", changeset);
        }

        remainingFeatures.Each(f => allWarnings.Add($"Data of the feature '{f}' in the response from DynaCon wasn't used for deserialization of any configuration model."
                                                    + " Consider removing it (in new service version if the feature was used in the past)."));

        return new ValidChangeset(changesetDto, contextHierarchy, source, url, allConfigs, allWarnings);
    }
}
