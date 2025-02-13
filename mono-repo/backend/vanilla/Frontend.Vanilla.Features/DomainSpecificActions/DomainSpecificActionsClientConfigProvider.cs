using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.DomainSpecificActions;

internal sealed class DomainSpecificActionsClientConfigProvider(IDsaConfiguration config, ILogger<DomainSpecificActionsClientConfigProvider> log)
    : LambdaClientConfigProvider("vnDomainSpecificActions", async cancellationToken =>
    {
        if (config.HtmlDocumentClientDslAction == null)
            return EmptyDictionary<string, object>.Singleton;

        try
        {
            var clientAction = await config.HtmlDocumentClientDslAction.ExecuteToClientScriptAsync(cancellationToken);

            return new { DslAction = clientAction };
        }
        catch (Exception ex)
        {
            log.LogError(ex,
                "Failed preparing configured {dslAction} for client. Its execution will be skipped which may lead to further errors",
                config.HtmlDocumentClientDslAction.ToString());

            return EmptyDictionary<string, object>.Singleton;
        }
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
