using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Core.Validation;

namespace Frontend.Vanilla.Features.Globalization.Configuration;

/// <summary>
/// Creates config from DTO and fully validates it.
/// </summary>
internal sealed class GlobalizationConfigurationFactory(ILanguageFactory langFactory)
    : SimpleConfigurationFactory<IGlobalizationConfiguration, GlobalizationConfigurationDto>
{
    public override IGlobalizationConfiguration Create(GlobalizationConfigurationDto dto)
    {
        // So that instances can be reference-compared easily, also avoids unnecessary double-deserialization
        var cache = new ConcurrentDictionary<string, LanguageInfo>();

        LanguageInfo CreateLanguage(string cultureName, string propertyName)
            => cache.GetOrAdd(cultureName, c => langFactory.Create(c, propertyName, dto.CultureMapping, dto.CultureOverrides));

        IReadOnlyList<LanguageInfo> CreateLanguages(IReadOnlyList<string> cultures, string propertyName)
            => cultures.ConvertAll(c => CreateLanguage(c, propertyName));

        var config = new GlobalizationConfiguration(
            defaultLanguage: CreateLanguage(dto.DefaultCultureName, nameof(dto.DefaultCultureName)),
            searchEngineLanguage: dto.SearchEngineCultureName != null
                ? CreateLanguage(dto.SearchEngineCultureName, nameof(dto.SearchEngineCultureName))
                : null,
            useBrowserLanguage: dto.UseBrowserLanguage,
            allowedLanguages: CreateLanguages(dto.AllowedCultureNames, nameof(dto.AllowedCultureNames)),
            hiddenLanguages: CreateLanguages(dto.HiddenCultureNames, nameof(dto.HiddenCultureNames)),
            offlineLanguages: CreateLanguages(dto.OfflineCultureNames, nameof(dto.OfflineCultureNames)),
            internalLanguages: CreateLanguages(dto.InternalCultureNames, nameof(dto.InternalCultureNames)));

        var errors = new List<ValidationResult>();

        if (!config.AllowedLanguages.Contains(config.DefaultLanguage))
            errors.Add($"DefaultCultureName '{config.DefaultLanguage}' must be part of AllowedCultureNames: {config.AllowedLanguages.Join()}.",
                nameof(dto.DefaultCultureName));

        if (config.HiddenLanguages.Contains(config.DefaultLanguage))
            errors.Add($"DefaultCultureName '{config.DefaultLanguage}' must NOT be part of HiddenCultureNames: {config.HiddenLanguages.Join()}.",
                nameof(dto.DefaultCultureName));

        if (config.SearchEngineLanguage != null && !config.AllowedLanguages.Contains(config.SearchEngineLanguage))
            errors.Add($"SearchEngineCultureName '{config.SearchEngineLanguage}' must be part of AllowedCultureNames: {config.AllowedLanguages.Join()}.",
                nameof(dto.SearchEngineCultureName));

        var notAllowedHidden = config.HiddenLanguages.Except(config.AllowedLanguages).ToList();
        if (notAllowedHidden.Count > 0)
            errors.Add($"All HiddenCultureNames must be part of AllowedCultureNames but these are NOT: {notAllowedHidden.Dump()}.", nameof(dto.HiddenCultureNames));

        CheckNoIntersection(config.AllowedLanguages, nameof(dto.AllowedCultureNames), config.InternalLanguages, nameof(dto.InternalCultureNames));
        CheckNoIntersection(config.AllowedLanguages, nameof(dto.AllowedCultureNames), config.OfflineLanguages, nameof(dto.OfflineCultureNames));
        CheckNoIntersection(config.InternalLanguages, nameof(dto.InternalCultureNames), config.OfflineLanguages, nameof(dto.OfflineCultureNames));

        var routeValueDuplicates = config.AllowedLanguages
            .Concat(config.OfflineLanguages)
            .Concat(config.InternalLanguages)
            .Distinct()
            .FindDuplicatesBy(l => l.RouteValue, RequiredStringComparer.OrdinalIgnoreCase);

        routeValueDuplicates.Each(d => errors.Add(
            "Each one of AllowedCultureNames, InternalCultureNames and OfflineCultureNames must map to unique RouteValue specified in CultureMapping"
            + $" to determine language from URL but same RouteValue '{d.Key}' is specified for cultures: {d.Join()}.",
            nameof(dto.CultureMapping)));

        var nativeNameDuplicates = config.AllowedLanguages
            .Concat(config.InternalLanguages)
            .Distinct()
            .FindDuplicatesBy(l => l.NativeName, RequiredStringComparer.OrdinalIgnoreCase);

        nativeNameDuplicates.Each(d => errors.Add(
            "Each one of AllowedCultureNames must map to unique NativeName specified in CultureMapping"
            + $" so that user can clearly choose between them but same NativeName '{d.Key}' is specified for cultures: {d.Join()}.",
            nameof(dto.CultureMapping)));

        return errors.Count == 0
            ? config
            : throw new InvalidConfigurationException(errors);

        void CheckNoIntersection(IEnumerable<LanguageInfo> languages1, string propertyName1, IEnumerable<LanguageInfo> languages2, string propertyName2)
        {
            var intersection = languages1.Intersect(languages2).ToList();
            if (intersection.Count > 0)
                errors.Add($"{propertyName1} must NOT contain any of {propertyName2} but both contain: {intersection.Join()}", propertyName1);
        }
    }
}
