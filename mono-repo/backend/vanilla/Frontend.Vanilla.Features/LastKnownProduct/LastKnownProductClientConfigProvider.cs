using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LastKnownProduct;

internal sealed class LastKnownProductClientConfigProvider(
    ILastKnownProductConfiguration lastKnownProductConfiguration,
    IContentService contentService,
    IAppDslProvider appDslProvider)
    : LambdaClientConfigProvider("vnLastKnownProduct",
        async ct => new
        {
            enabled = await lastKnownProductConfiguration.Enabled.EvaluateForClientAsync(ct),
            appDslProvider.Product,
            url = (await contentService.GetRequiredAsync<ILinkTemplate>(AppPlugin.ObsoleteContentRoot + "/Links/BackToProduct", ct)).Url?.ToString(),
        }) { }
