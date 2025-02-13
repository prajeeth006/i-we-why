using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.CookieConsent;

internal class CookieConsentClientConfigProvider(
    IVanillaClientContentService clientContentService,
    ICookieConsentConfiguration cookieConsentConfig,
    ILogger<CookieConsentClientConfigProvider> log)
    : LambdaClientConfigProvider("vnCookieConsent", async cancellationToken =>
    {
        var conditionTask = cookieConsentConfig.TryAsync(c => c.Condition.EvaluateForClientAsync(cancellationToken), log);
        var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/CookieConsent/Message", cancellationToken);

        return new
        {
            condition = await conditionTask,
            content = await contentTask,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
