using System;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Validates meaningfulness of specified overrides before creating a changeset by merging them in.
/// </summary>
internal sealed class OverridesValidationOverrider(IChangesetOverrider inner) : IChangesetOverrider
{
    public IValidChangeset Override(IValidChangeset changeset, JObject overridesJson)
    {
        var featuresJson = overridesJson.GetFeatures();

        if (featuresJson != null)
        {
            CheckNoDuplicateFeaturesAndKeys(featuresJson);
            CheckFeaturesAndKeysExist(featuresJson, changeset.Dto);
        }
        else if (overridesJson.Count > 0)
        {
            throw new Exception($"Overrides JSON don't contain Configuration root property but instead: {overridesJson.Properties().Select(p => p.Name).Dump()}.");
        }

        return inner.Override(changeset, overridesJson);
    }

    private static void CheckNoDuplicateFeaturesAndKeys(JObject featuresJson)
    {
        var duplicateFeatures = featuresJson.Properties().FindDuplicatesBy(f => f.Name, StringComparer.OrdinalIgnoreCase).FirstOrDefault();

        if (duplicateFeatures != null)
            throw new Exception($"Overrides contain a feature specified multiple times: {duplicateFeatures.Select(f => f.Name).Dump()}.");

        foreach (var featureJson in featuresJson)
        {
            if (featureJson.Value == null) continue;

            var duplicateKeys = ((JObject)featureJson.Value).Properties().FindDuplicatesBy(k => k.Name, StringComparer.OrdinalIgnoreCase).FirstOrDefault();

            if (duplicateKeys != null)
                throw new Exception($"Overrides contain a feature '{featureJson.Key}' with a key specified multiple times: {duplicateKeys.Select(f => f.Name).Dump()}.");
        }
    }

    private static void CheckFeaturesAndKeysExist(JObject featuresJson, ConfigurationResponse changesetDto)
    {
        foreach (var featureJson in featuresJson)
        {
            if (!changesetDto.Configuration.TryGetValue(featureJson.Key, out var featureDto))
                throw new Exception($"Active changeset {changesetDto.ChangesetId} doesn't contain Feature '{featureJson.Key}' so it can't be overridden."
                                    + $" Existing Features: {changesetDto.Configuration.Keys.Dump()}.");

            if (featureJson.Value == null) continue;

            foreach (var keyJson in (JObject)featureJson.Value)
                if (!featureDto.ContainsKey(keyJson.Key))
                    throw new Exception(
                        $"Feature '{featureJson.Key}' of active changeset {changesetDto.ChangesetId} doesn't contain Key '{keyJson.Key}' so it can't be overridden."
                        + $" Existing Keys of the Feature: {featureDto.Keys.Dump()}.");
        }
    }
}
