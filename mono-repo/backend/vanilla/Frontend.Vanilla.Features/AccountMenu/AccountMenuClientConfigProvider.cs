using System.Collections.Generic;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Header;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.AccountMenu;

internal sealed class AccountMenuClientConfigProvider(
    IMenuFactory menuFactory,
    IVanillaClientContentService clientContentService,
    IAccountMenuConfiguration accountMenuConfig,
    IHeaderConfiguration headerConfiguration,
    ILogger<AccountMenuClientConfigProvider> log)
    : LambdaClientConfigProvider("vnAccountMenu", async cancellationToken =>
    {
        var rootTask = menuFactory.GetItemAsync(
            $"{AppPlugin.ContentRoot}/AccountMenu{(accountMenuConfig.Version > 1 ? accountMenuConfig.Version : "")}/Main",
            DslEvaluation.PartialForClient,
            cancellationToken);
        var isPaypalBalanceMessageEnabledTask = accountMenuConfig.TryAsync(c => c.PaypalBalanceMessageEnabled.EvaluateForClientAsync(cancellationToken), log);
        var isPaypalReleaseFundsEnabled = accountMenuConfig.TryAsync(c => c.PaypalReleaseFundsEnabled.EvaluateForClientAsync(cancellationToken), log);
        var vipTask = accountMenuConfig.Version == 2
            ? menuFactory.GetSectionAsync($"{AppPlugin.ContentRoot}/AccountMenu2/VIP", DslEvaluation.PartialForClient, cancellationToken)
            : DefaultResultTask<MenuSection?>.Value;

        var tourItemsTask = accountMenuConfig.Version is 3 or 5
            ? clientContentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/AccountMenu{accountMenuConfig.Version}/OnBoarding/TourItems", cancellationToken, DslEvaluation.PartialForClient)
            : DefaultResultTask<IReadOnlyList<ClientDocument>>.Value;
        var startTourScreenTask = accountMenuConfig.Version is 3 or 5
            ? menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/AccountMenu{accountMenuConfig.Version}/OnBoarding/StartTourScreen", DslEvaluation.PartialForClient, cancellationToken)
            : DefaultResultTask<MenuItem?>.Value;
        var resources = accountMenuConfig.Version == 1
            ? await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/AccountMenu/Resources", cancellationToken)
            : null;
        var vipLevels = (await vipTask)?.Items;

        var account = new
        {
            root = await rootTask,
            isPaypalBalanceMessageEnabled = await isPaypalBalanceMessageEnabledTask,
            isPaypalReleaseFundsEnabled = await isPaypalReleaseFundsEnabled,
            accountMenuConfig.VipLevels,
            accountMenuConfig.IgnoreVipLevel,
            accountMenuConfig.Version,
            accountMenuConfig.CashbackType,
            accountMenuConfig.Onboarding,
            accountMenuConfig.ShowHeaderBarClose,
            accountMenuConfig.PokerCashbackTournamentAwardTypes,
            accountMenuConfig.TournamentPokerCashbackSymbol,
            headerConfiguration.OnboardingEnabled,
            accountMenuConfig.UseLoyaltyBannerV2,
            accountMenuConfig.ProfilePageItemsPosition,
        };

        var onBoarding = new
        {
            startTourScreen = await startTourScreenTask,
            tourItems = await tourItemsTask,
        };

        return new { account, resources, vipLevels, onBoarding };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
