using Frontend.Vanilla.Core.Rest;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal class ReCaptchaGoogleVerifyData(RestResponse restResponse, ReCaptchaResponse response)
{
    public RestResponse RestResponse { get; } = restResponse;
    public ReCaptchaResponse Response { get; } = response;
}
