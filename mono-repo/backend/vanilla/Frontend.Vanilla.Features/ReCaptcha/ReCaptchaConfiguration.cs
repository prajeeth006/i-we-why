#nullable disable

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// ReCAPTCHA configuration.
/// </summary>
internal interface IReCaptchaConfiguration
{
    string ApiUrl { get; }
    string EnterpriseSiteKey { get; }
    string EnterpriseSecretKey { get; }
    string EnterpriseProjectId { get; }
    string Theme { get; }
    IReadOnlyDictionary<string, ReCaptchaEnablement> Areas { get; }
    IReadOnlyDictionary<string, double> Thresholds { get; }
    int FailureCount { get; }
    TimeSpan FailureCountExpiration { get; }
    bool InstrumentationOnPageLoad { get; }
    bool IsSuccessLogEnabled { get; }
    bool LogAdditionalData { get; }
    bool BypassTechnicalError { get; }
    bool EnableHostNameValidation { get; }
    bool IncludeUserIpAddress { get; }
}

internal enum ReCaptchaEnablement
{
    Enabled,
    EnableOnFailureCount,
    Disabled,
}

internal sealed class ReCaptchaConfigurationDto
{
    public string ApiUrl { get; set; }
    public string EnterpriseSiteKey { get; set; }
    public string EnterpriseSecretKey { get; set; }
    public string EnterpriseProjectId { get; set; }
    public string Theme { get; set; }
    public bool InstrumentationOnPageLoad { get; set; }
    public bool IsSuccessLogEnabled { get; set; }

    [Minimum(1)]
    public int FailureCount { get; set; }

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan FailureCountExpiration { get; set; }

    [Required, RequiredKeys]
    public IReadOnlyDictionary<string, ReCaptchaEnablement> Areas { get; set; }

    [Required]
    public IReadOnlyDictionary<string, double> Thresholds { get; set; }

    public bool LogAdditionalData { get; set; }
    public bool BypassTechnicalError { get; set; }
    public bool EnableHostNameValidation { get; set; }
    public bool IncludeUserIpAddress { get; set; }
}

internal sealed class ReCaptchaConfiguration : IReCaptchaConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ReCaptcha";

    public string ApiUrl { get; set; }
    public string EnterpriseSiteKey { get; set; }
    public string EnterpriseSecretKey { get; set; }
    public string EnterpriseProjectId { get; set; }
    public string Theme { get; set; }
    public bool InstrumentationOnPageLoad { get; set; }
    public bool IsSuccessLogEnabled { get; set; }
    public bool LogAdditionalData { get; set; }
    public bool BypassTechnicalError { get; set; }
    public bool EnableHostNameValidation { get; set; }
    public IReadOnlyDictionary<string, ReCaptchaEnablement> Areas { get; set; }
    public IReadOnlyDictionary<string, double> Thresholds { get; set; }
    public int FailureCount { get; set; }
    public TimeSpan FailureCountExpiration { get; set; }
    public bool IncludeUserIpAddress { get; set; }
}
