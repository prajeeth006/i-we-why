using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;

/// <summary>
/// Main implementation of <see cref="IFeatureDeserializer" />.
/// </summary>
internal sealed class DefaultFeatureDeserializer(IInstanceJsonResolver jsonResolver, IInstanceDeserializer instanceDeserializer) : IFeatureDeserializer
{
    public const string ErrorMessage = "Failed deserializing configuration instances.";

    public WithWarnings<IReadOnlyList<FeatureConfiguration>> Deserialize(
        IConfigurationInfo info,
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var allConfigs = new List<FeatureConfiguration>();
        var allErrors = new List<InstanceDeserializationException>();
        var allWarnings = new List<TrimmedRequiredString>();
        var jsonsWithContext = jsonResolver.Resolve(featureDto, contextHierarchy);

        foreach (var item in jsonsWithContext)
            try
            {
                var (config, warnings) = instanceDeserializer.Deserialize(info, item.instanceJson);

                allConfigs.Add(new FeatureConfiguration(config, item.context));
                allWarnings.Add(warnings); // TODO add context
            }
            catch (Exception ex)
            {
                allErrors.Add(new InstanceDeserializationException(item.context, ex));
            }

        return allErrors.Count == 0
            ? allConfigs.WithWarnings<IReadOnlyList<FeatureConfiguration>>(allWarnings)
            : throw new AggregateException(ErrorMessage, allErrors);
    }
}
