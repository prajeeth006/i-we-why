using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Globalization.Configuration;

/// <summary>
/// Creates and validates single language based on given culture name and culture mapping.
/// </summary>
internal interface ILanguageFactory
{
    LanguageInfo Create(
        string? cultureName,
        string configPropertyName,
        Dictionary<string, LanguageInfoDto> cultureMapping,
        Dictionary<string, JObject> cultureOverrides);
}

internal sealed class LanguageFactory(ICultureOverridesMerger cultureOverridesMerger, ICultureSerializer cultureSerializer)
    : ILanguageFactory
{
    public LanguageInfo Create(
        string? cultureName,
        string configPropertyName,
        Dictionary<string, LanguageInfoDto> cultureMapping,
        Dictionary<string, JObject> cultureOverrides)
    {
        var culture = CreateDotNetCulture(cultureName, configPropertyName, cultureOverrides);
        var dto = cultureMapping.GetValue(culture.Name)
                  ?? throw CreateError($"CultureMapping is missing an entry for culture '{culture}' referred from {configPropertyName}.",
                      nameof(GlobalizationConfigurationDto.CultureMapping));

        try
        {
            return new LanguageInfo(
                culture,
                dto.NativeName!,
                dto.RouteValue!,
                dto.SitecoreContentLanguage!,
                dto.SitecoreContentDefaultLanguage,
                dto.HtmlLangAttribute!,
                dto.AngularLocale!);
        }
        catch (ArgumentException ex)
        {
            var message = $"CultureMapping['{cultureName}'].{ex.ParamName?.Capitalize()} referred from {configPropertyName} is invalid: {ex.Message}.";

            throw CreateError(message, nameof(GlobalizationConfigurationDto.CultureMapping));
        }
    }

    private CultureInfo CreateDotNetCulture(string? cultureName, string configPropertyName, Dictionary<string, JObject> cultureOverrides)
    {
        var culture = CultureInfoHelper.Find(cultureName)
                      ?? throw CreateError($"Value {cultureName.Dump()} is not a supported .NET culture.", configPropertyName);

        try
        {
            var cultureOverride = cultureOverridesMerger.MergeOverridesChain(culture, cultureOverrides);
            cultureSerializer.DeserializeAndPopulateOverride(culture, cultureOverride);

            return culture;
        }
        catch (Exception ex)
        {
            throw CreateError($"Failed to apply CultureOverrides on top of culture '{culture}': {ex.GetMessageIncludingInner()}.",
                nameof(GlobalizationConfigurationDto.CultureOverrides));
        }
    }

    private static Exception CreateError(string message, string propertyName)
        => new InvalidConfigurationException(new ValidationResult(message, new[] { propertyName }));
}
