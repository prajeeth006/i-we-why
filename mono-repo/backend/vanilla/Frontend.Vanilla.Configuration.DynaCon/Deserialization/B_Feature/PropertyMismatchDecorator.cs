using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;

/// <summary>
/// Checks for mismatch between config CLR properties and keys returned from DynaCon.
/// </summary>
internal sealed class PropertyMismatchDecorator(IFeatureDeserializer inner) : IFeatureDeserializer
{
    public WithWarnings<IReadOnlyList<FeatureConfiguration>> Deserialize(
        IConfigurationInfo info,
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var (configs, warnings) = inner.Deserialize(info, featureDto, contextHierarchy);
        var mismatchWarnings = GetMismatchWarnings(info, featureDto);

        return configs.WithWarnings(warnings.Concat(mismatchWarnings));
    }

    private static IEnumerable<TrimmedRequiredString> GetMismatchWarnings(IConfigurationInfo info, IReadOnlyDictionary<string, KeyConfiguration> featureDto)
    {
        if (info.ImplementationParameters == null)
            yield break;

        var dtoProperties = featureDto.Keys.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var clrProperties = info.ImplementationParameters.Select(p => p.Name.Value).ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var missing in clrProperties.Where(x => !dtoProperties.Contains(x)))
            yield return $"Missing key {missing} in the response from DynaCon.";

        foreach (var unused in dtoProperties.Where(x => !clrProperties.Contains(x)))
            yield return $"There is unused key {unused} in the response from DynaCon.";
    }
}
