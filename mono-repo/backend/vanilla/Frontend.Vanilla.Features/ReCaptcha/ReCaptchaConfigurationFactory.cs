using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Core.Validation;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Additional validation: forbids usage of test keys on production.
/// </summary>
internal sealed class ReCaptchaConfigurationFactory(IEnvironmentProvider envProvider) : SimpleConfigurationFactory<IReCaptchaConfiguration, ReCaptchaConfigurationDto>
{
    // TODO: Check if this dependency is needed
    private readonly IEnvironmentProvider envProvider = Guard.NotNull(envProvider, nameof(envProvider));

    public override IReCaptchaConfiguration Create(ReCaptchaConfigurationDto dto)
    {
        var config = new ReCaptchaConfiguration
        {
            ApiUrl = dto.ApiUrl,
            Areas = Enumerable.ToDictionary(dto.Areas, StringComparer.OrdinalIgnoreCase).AsReadOnly(),
            Thresholds = Enumerable.ToDictionary(dto.Thresholds, StringComparer.OrdinalIgnoreCase).AsReadOnly(),
            Theme = dto.Theme?.ToLower(),
            FailureCount = dto.FailureCount,
            FailureCountExpiration = dto.FailureCountExpiration,
            EnterpriseSiteKey = dto.EnterpriseSiteKey,
            EnterpriseSecretKey = dto.EnterpriseSecretKey,
            EnterpriseProjectId = dto.EnterpriseProjectId,
            InstrumentationOnPageLoad = dto.InstrumentationOnPageLoad,
            IsSuccessLogEnabled = dto.IsSuccessLogEnabled,
            LogAdditionalData = dto.LogAdditionalData,
            BypassTechnicalError = dto.BypassTechnicalError,
            EnableHostNameValidation = dto.EnableHostNameValidation,
            IncludeUserIpAddress = dto.IncludeUserIpAddress,
        };

        var errors = new List<ValidationResult>();

        foreach (var entry in config.Areas.Where(a => !a.Value.IsDefinedEnum()))
            errors.Add($"Areas['{entry.Key}']='{entry.Value}' is invalid. Supported values: Enabled, EnableOnFailureCount, Disabled.", nameof(config.Areas));

        foreach (var entry in config.Thresholds.Where(a => a.Value < 0 || a.Value > 1))
            errors.Add($"Thresholds['{entry.Key}']='{entry.Value}' is invalid. Only numbers from 0 to 1 are supported.", nameof(config.Thresholds));

        RequireKey(nameof(config.EnterpriseSiteKey), config.EnterpriseSiteKey, errors);
        RequireKey(nameof(config.EnterpriseSecretKey), config.EnterpriseSecretKey, errors);

        var missingThresholds = config.Areas.Keys.Where(k => !config.Thresholds.ContainsKey(k)).ToList();

        if (missingThresholds.Any())
        {
            errors.Add($"RecaptchaEnterprise requires thresholds to be configured for all defined areas, but is missing thresholds for '{missingThresholds.Join()}'.",
                nameof(config.Thresholds));
        }

        return errors.Count == 0
            ? config
            : throw new InvalidConfigurationException(errors);
    }

    private static void RequireKey(string propertyName, string value, ICollection<ValidationResult> errors)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors.Add($"RecaptchaEnterprise key {propertyName} is required.", propertyName);
        }
    }
}
