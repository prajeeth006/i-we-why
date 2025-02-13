using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;

/// <summary>
/// Guards that number of config instances don't overflow causing app death.
/// </summary>
internal sealed class InstanceCountOverflowDecorator(IFeatureDeserializer inner) : IFeatureDeserializer
{
    private const int CountToWarn = 100;
    private const int CountToThrow = 100_000;

    public WithWarnings<IReadOnlyList<FeatureConfiguration>> Deserialize(
        IConfigurationInfo info,
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var (configs, warnings) = inner.Deserialize(info, featureDto, contextHierarchy);

        if (configs.Count > CountToThrow)
        {
            var contexts = featureDto.Values
                .SelectMany(v => v.Values)
                .Select(v => v.Context)
                .Distinct(DictionaryEqualityComparer<string, string>.Singleton);

            throw new Exception($"There are {configs.Count} configuration instances as a result of possible variation context combinations."
                                + " This is not sustainable for the app because of resolution performance and amount of consumed resources. Please reduce the number of different contexts/values in DynaCon."
                                + $" Contexts from input DTO: {JsonConvert.SerializeObject(contexts)}");
        }

        var newWarnings = configs.Count > CountToWarn
            ? warnings.Append(
                (TrimmedRequiredString)$"There are too many {configs.Count} configuration instances. This may impact resolution performance and amount of consumed resources.")
            : warnings;

        return configs.WithWarnings(newWarnings);
    }
}
