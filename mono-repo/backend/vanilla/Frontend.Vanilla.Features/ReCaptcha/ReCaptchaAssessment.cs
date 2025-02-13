#nullable disable

using System;
using System.Collections.Generic;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>Provides reCAPTCHA Enterprise assessment data. </summary>
public sealed class ReCaptchaAssessment
{
    /// <summary>The event being assessed.</summary>
    public RecaptchaEvent Event { get; set; }

    /// <summary>
    /// The resource name for the Assessment in the format "projects/{project_number}/assessments/{assessment_id}".
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Recaptcha enterprise risk analysis.
    /// </summary>
    public RiskAnalysis RiskAnalysis { get; set; }

    /// <summary>
    /// Properties of the provided event token.
    /// </summary>
    public TokenProperties TokenProperties { get; set; }
}

/// <summary>
/// Provides the event being assessed.
/// </summary>
public sealed class RecaptchaEvent
{
    /// <summary>
    /// The URI resource the user requested that triggered an assessment.
    /// </summary>
    [CanBeNull]
    public string RequestedUri { get; set; }

    /// <summary>
    /// The user agent present in the request from the user's device related to this event.
    /// </summary>
    [CanBeNull]
    public string UserAgent { get; set; }

    /// <summary>
    /// Optional JA3 fingerprint for SSL clients.
    /// </summary>
    [CanBeNull]
    public string Ja3 { get; set; }

    /// <summary>
    /// The site key that was used to invoke reCAPTCHA Enterprise on your site and generate the token.
    /// </summary>
    [CanBeNull]
    public string SiteKey { get; set; }

    /// <summary>
    /// The user response token provided by the reCAPTCHA Enterprise client-side integration on your site.
    /// </summary>
    [CanBeNull]
    public string Token { get; set; }

    /// <summary>
    /// Unique stable hashed user identifier for the request. The identifier must be hashed using hmac-sha256 with stable secret.
    /// </summary>
    [CanBeNull]
    public string HashedAccountId { get; set; }

    /// <summary>
    /// Flag for running WAF token assessment. If enabled, the token must be specified, and have been created by a WAF-enabled key.
    /// </summary>
    public bool? WafTokenAssessment { get; set; }

    /// <summary>
    /// The expected action for this type of event.
    /// This should be the same action provided at token generation time on client-side platforms already integrated with recaptcha enterprise.
    /// </summary>
    [CanBeNull]
    public string ExpectedAction { get; set; }

    /// <summary>
    /// Flag for enabling firewall policy config assessment.
    /// If this flag is enabled, the firewall policy will be evaluated and a suggested firewall action will be returned in the response.
    /// </summary>
    public bool? FirewallPolicyEvaluation { get; set; }

    // TODO: Implement if needed.
    // public TransactionData TransactionData { get; set; }

    /// <summary>
    /// Flag for a reCAPTCHA express request for an assessment without a token. If enabled, `site_key` must reference a SCORE key with WAF feature set to EXPRESS.
    /// </summary>
    public bool? Express { get; set; }

    /// <summary>
    /// The IP address in the request from the user's device related to this event.
    /// </summary>
    [CanBeNull]
    public string UserIpAddress { get; set; }

    /// <summary>
    /// HTTP header information about the request.
    /// </summary>
    [CanBeNull]
    public string[] Headers { get; set; }
}

/// <summary>
/// Google Cloud Recaptcha enterprise risk analysis.
/// </summary>
public sealed class RiskAnalysis
{
    /// <summary>
    /// Reasons contributing to the risk analysis verdict.
    /// </summary>
    public IEnumerable<ClassificationReasons> Reasons { get; set; }

    /// <summary>Legitimate event score from 0.0 to 1.0. (1.0 means very likely legitimate traffic while 0.0 means very likely non-legitimate traffic).</summary>
    public double Score { get; set; }

    /// <summary>
    /// Extended verdict reasons to be used for experimentation only. The set of possible reasons is subject to change.
    /// </summary>
    public string[] ExtendedVerdictReasons { get; set; }
}

/// <summary>
/// Properties of the provided event token.
/// </summary>
public sealed class TokenProperties
{
    /// <summary>
    /// Reason associated with the response when valid = false.
    /// </summary>
    public InvalidReasons InvalidReason { get; set; }

    /// <summary>
    /// Whether the provided user response token is valid. When valid = false, the reason could be specified in invalidReason or it could also be due to a user failing to solve a challenge or a sitekey mismatch (i.e the sitekey used to generate the token was different than the one specified in the assessment).
    /// </summary>
    public bool Valid { get; set; }

    /// <summary>
    /// Action name provided at token generation.
    /// </summary>
    public string Action { get; set; }

    /// <summary>
    /// The ID of the iOS bundle with which the token was generated (iOS keys only).
    /// </summary>
    public string IosBundleId { get; set; }

    /// <summary>
    /// The timestamp corresponding to the generation of the token.
    /// </summary>
    public DateTime CreateTime { get; set; }

    /// <summary>
    /// The hostname of the page on which the token was generated.
    /// </summary>
    public string Hostname { get; set; }

    /// <summary>
    /// The name of the Android package with which the token was generated (Android keys only).
    /// </summary>
    public string AndroidPackageName { get; set; }
}

/// <summary>Gets Recaptcha token invalid reasons.</summary>
public enum InvalidReasons
{
    /// <summary>
    /// Default unspecified type.
    /// </summary>
    INVALID_REASON_UNSPECIFIED,

    /// <summary>
    /// If the failure reason was not accounted for.
    /// </summary>
    UNKNOWN_INVALID_REASON,

    /// <summary>
    /// The provided user verification token was malformed.
    /// </summary>
    MALFORMED,

    /// <summary>
    /// The user verification token had expired.
    /// </summary>
    EXPIRED,

    /// <summary>
    /// The user verification had already been seen.
    /// </summary>
    DUPE,

    /// <summary>
    /// The user verification token was not present. It is a required input.
    /// </summary>
    MISSING,

    /// <summary>
    /// Browser error during verification.
    /// </summary>
    BROWSER_ERROR,
}

/// <summary>Gets geolocation coordinates.</summary>
public enum ClassificationReasons
{
    /// <summary>Default unspecified type.
    /// </summary>
    CLASSIFICATION_REASON_UNSPECIFIED,

    /// <summary>
    /// Interactions matched the behavior of an automated agent.
    /// </summary>
    AUTOMATION,

    /// <summary>
    /// The event originated from an illegitimate environment.
    /// </summary>
    UNEXPECTED_ENVIRONMENT,

    /// <summary>
    /// Traffic volume from the event source is higher than normal.
    /// </summary>
    TOO_MUCH_TRAFFIC,

    /// <summary>
    /// Interactions with the site were significantly different than expected patterns.
    /// </summary>
    UNEXPECTED_USAGE_PATTERNS,

    /// <summary>
    /// Too little traffic has been received from this site thus far to generate quality risk analysis.
    /// </summary>
    LOW_CONFIDENCE_SCORE,

    /// <summary>
    /// Suspected carding.
    /// </summary>
    SUSPECTED_CARDING,

    /// <summary>
    /// Suspected chargeback.
    /// </summary>
    SUSPECTED_CHARGEBACK,
}

/// <summary>
/// Represents the types of annotations.
/// </summary>
public enum AssessmentAnnotations
{
    /// <summary>
    /// Default unspecified type.
    /// </summary>
    ANNOTATION_UNSPECIFIED,

    /// <summary>
    /// Provides information that the event turned out to be legitimate.
    /// </summary>
    LEGITIMATE,

    /// <summary>
    /// Provides information that the event turned out to be fraudulent.
    /// </summary>
    FRAUDULENT,

    /// <summary>
    /// Provides information that the event was related to a login event in which the user typed the correct password.
    /// </summary>
    PASSWORD_CORRECT,

    /// <summary>
    /// Provides information that the event was related to a login event in which the user typed the incorrect password.
    /// </summary>
    PASSWORD_INCORRECT,
}
