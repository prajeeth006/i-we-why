using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal sealed class ReCaptchaClientConfigProvider(IReCaptchaConfiguration config, IReCaptchaService reCaptchaService, ILogger<ReCaptchaClientConfigProvider> log)
    : LambdaClientConfigProvider("vnReCaptcha", async cancellationToken =>
    {
        var verificationMessage = await reCaptchaService.TryAsync(_ => reCaptchaService.GetVerificationMessageAsync(cancellationToken), log);

        return new { config.EnterpriseSiteKey, config.InstrumentationOnPageLoad, config.Theme, verificationMessage };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
