namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Possible reCAPTCHA error codes.
/// </summary>
internal static class ReCaptchaErrorCodes
{
    /// <summary>
    /// The secret parameter is missing.
    /// </summary>
    public const string MissingInputSecret = "missing-input-secret";

    /// <summary>
    /// The secret parameter is invalid or malformed.
    /// </summary>
    public const string InvalidInputSecret = "invalid-input-secret";

    /// <summary>
    /// The response parameter is missing.
    /// </summary>
    public const string MissingInputResponse = "missing-input-response";

    /// <summary>
    /// The response parameter is invalid or malformed.
    /// </summary>
    public const string InvalidInputResponse = "invalid-input-response";

    /// <summary>
    /// The request is invalid or malformed.
    /// </summary>
    public const string BadRequest = "bad-request";

    /// <summary>
    /// User response token has timed out, or it was already verified before.
    /// </summary>
    public const string TimeoutOrDuplicate = "timeout-or-duplicate";

    /// <summary>
    /// User response was not provided as an input.
    /// </summary>
    public const string MissingUserResponse = "missing-user-response";

    /// <summary>
    /// Response <c>action</c> did not match requested <c>area</c>.
    /// </summary>
    public const string ActionMismatch = "action-mismatch";

    /// <summary>
    /// reCAPTCHA is not enabled for this area.
    /// </summary>
    public const string Disabled = "disabled";

    /// <summary>
    /// The users score was below the specified threshold.
    /// </summary>
    public const string ScoreThresholdNotMet = "score-threshold-not-met";

    /// <summary>
    /// The hostname is not in the same domain as current label.
    /// </summary>
    public const string InvalidHostName = "invalid-hostname";
}
