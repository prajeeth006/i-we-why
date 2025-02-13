using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.RedirectMessage;

internal class RedirectMessageClientConfigProvider(
    IVanillaClientContentService clientContentService,
    IRedirectMessageConfiguration redirectConfig,
    IEnvironmentProvider envProvider,
    ILogger<RedirectMessageClientConfigProvider> log)
    : LambdaClientConfigProvider("vnRedirectMessage", async cancellationToken =>
    {
        var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/RedirectMessage/MessageWithCountryName", cancellationToken);

        foreach (var redirect in redirectConfig.Rules)
        {
            if (await redirect.TryAsync(c => c.Condition.EvaluateAsync(cancellationToken), log))
            {
                return new
                {
                    currentLabel = envProvider.CurrentLabel,
                    redirectLabel = redirect.Redirect.Label,
                    url = redirect.Redirect.Url,
                    content = await contentTask,
                };
            }
        }

        return new { };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Never happens
}
