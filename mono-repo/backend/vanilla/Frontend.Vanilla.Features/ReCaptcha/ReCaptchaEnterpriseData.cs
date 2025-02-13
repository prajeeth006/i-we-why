using Frontend.Vanilla.Core.Rest;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal class ReCaptchaEnterpriseData(RestResponse restResponse, ReCaptchaAssessment response)
{
    public RestResponse RestResponse { get; } = restResponse;
    public ReCaptchaAssessment Response { get; } = response;
}
