namespace Frontend.Vanilla.Features.ReCaptcha;

internal class ReCaptchaEnterpriseRequest(RecaptchaEvent recaptchaEvent)
{
    public RecaptchaEvent Event { get; } = recaptchaEvent;
}
