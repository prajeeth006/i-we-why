using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.SmartBanner;

internal class SmartBannerClientConfigProvider(
    ISmartBannerConfiguration smartBannerConfig,
    IMenuFactory menuFactory,
    IVanillaClientContentService clientContentService,
    ILogger<SmartBannerClientConfigProvider> log)
    : LambdaClientConfigProvider("vnSmartBanner", async cancellationToken =>
    {
        var isEnabledTask = smartBannerConfig.TryAsync(c => c.IsEnabled.EvaluateForClientAsync(cancellationToken), log);
        var contentTask = clientContentService.GetAsync($"{AppPlugin.ContentRoot}/SmartBanner/Content", cancellationToken);
        var appInfoTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/SmartBanner/Apps/{smartBannerConfig.AppId}",
            DslEvaluation.PartialForClient,
            cancellationToken);

        return new
        {
            isEnabledCondition = await isEnabledTask,
            content = await contentTask,
            appInfo = await appInfoTask,
            smartBannerConfig.AppId,
            smartBannerConfig.MinimumRating,
            smartBannerConfig.DisplayCounter,
            smartBannerConfig.ApiForDataSource,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
