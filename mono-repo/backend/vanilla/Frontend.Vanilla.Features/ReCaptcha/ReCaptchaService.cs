using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Facade with all logic related to reCAPTCHA.
/// </summary>
public interface IReCaptchaService
{
    /// <summary>
    /// Determines if reCAPTCHA is enabled for particular area and current context thus widget should be rendered.
    /// </summary>
    [DelegateTo(typeof(IEnablementService), nameof(IEnablementService.IsEnabledAsync))]
    Task<bool> IsEnabledAsync(TrimmedRequiredString area, CancellationToken cancellationToken);

    /// <summary>
    /// Verifies user's response from the specified version of reCAPTCHA against Google web service.
    /// </summary>
    [DelegateTo(typeof(IVerificationEvaluationService), nameof(IVerificationEvaluationService.VerifyUsersResponseAsync))]
    Task<bool> VerifyUsersResponseAsync(
        TrimmedRequiredString area,
        string? usersResponse,
        Dictionary<string, object> additionalParameters,
        CancellationToken cancellationToken);

    /// <summary>
    /// Creates a new Assessment based on user's reCAPTCHA response.
    /// </summary>
    [DelegateTo(typeof(IAssessmentService), nameof(IAssessmentService.CreateAssessmentAsync))]
    Task<ReCaptchaAssessment> CreateAssessmentAsync(RecaptchaEvent recaptchaEvent, CancellationToken cancellationToken);

    /// <summary>
    /// Annotates a previously created Assessment to provide additional information on whether the event turned out to be authentic or fraudulent.
    /// </summary>
    [DelegateTo(typeof(IAssessmentService), nameof(IAssessmentService.AnnotateAssessmentAsync))]
    Task AnnotateAssessmentAsync(string? assessmentName, AssessmentAnnotations annotation, CancellationToken cancellationToken);

    /// <summary>
    /// Reports success of operation where reCAPTCHA is used.
    /// This can change related counter to determine if reCAPTCHA should be enabled.
    /// </summary>
    [DelegateTo(typeof(IFailureCounter), nameof(IFailureCounter.ReportSucessAsync))]
    Task ReportSuccessAsync(TrimmedRequiredString area, CancellationToken cancellationToken);

    /// <summary>
    /// Reports failure of operation where reCAPTCHA is used.
    /// This can change related counter to determine if reCAPTCHA should be enabled.
    /// </summary>
    [DelegateTo(typeof(IFailureCounter), nameof(IFailureCounter.ReportFailureAsync))]
    Task ReportFailureAsync(TrimmedRequiredString area, CancellationToken cancellationToken);

    /// <summary>
    /// Resolves reCAPTCHA message which indicates verification failure because of invalid value or sudden enablement of reCAPTCHA protection.
    /// Throws if something goes wrong.
    /// </summary>
    [DelegateTo(typeof(IVerificationMessageProvider), nameof(IVerificationMessageProvider.GetAsync))]
    Task<RequiredString> GetVerificationMessageAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Resolves reCAPTCHA message which indicates verification failure because of invalid value or sudden enablement of reCAPTCHA protection.
    /// Throws if something goes wrong.
    /// </summary>
    [DelegateTo(typeof(IVerificationMessageProvider), nameof(IVerificationMessageProvider.GetVersionedAsync))]
    Task<RequiredString> GetVersionedVerificationMessageAsync(ReCaptchaVersion version, CancellationToken cancellationToken);
}
