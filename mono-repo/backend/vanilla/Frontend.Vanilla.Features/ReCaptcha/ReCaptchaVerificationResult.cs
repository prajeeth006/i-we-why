using System.Collections.Generic;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Represents a response from google reCAPTCHA site verification endpoint.
/// </summary>
internal sealed class ReCaptchaVerificationResult
{
    /// <summary>
    /// Creates an instance of <see cref="ReCaptchaVerificationResult"/>.
    /// </summary>
    public ReCaptchaVerificationResult(bool success, IReadOnlyList<string> errorCodes, double score = 0)
    {
        Success = success;
        Score = score;
        ErrorCodes = errorCodes;
    }

    /// <summary>
    /// Gets whether this request was a valid reCAPTCHA token for your site.
    /// </summary>
    public bool Success { get; }

    /// <summary>
    /// Gets the score for this request (0.0 - 1.0).
    /// NOTE: Only applicable to v3.
    /// </summary>
    public double Score { get; }

    /// <summary>
    /// Gets a list of errors that occured during reCAPTCHA request and validation.
    /// </summary>
    public IReadOnlyList<string> ErrorCodes { get; }
}
