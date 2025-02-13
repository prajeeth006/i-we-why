using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Tooltips;

internal sealed class TooltipsClientConfigProvider(IVanillaClientContentService contentService, ITooltipsConfiguration tooltipsConfiguration)
    : LambdaClientConfigProvider("vnTooltips", async cancellationToken =>
    {
        var onboardingItems = await contentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/Tooltips/Onboarding", cancellationToken);
        var tutorialsItems = await contentService.GetChildrenAsync($"{AppPlugin.ContentRoot}/Tooltips/Tutorial", cancellationToken);

        var onboardings = onboardingItems.ToDictionary(menu => menu.InternalId?.ItemName ?? string.Empty);
        var tutorials = tutorialsItems.ToDictionary(menu => menu.InternalId?.ItemName ?? string.Empty);

        var tooltips = new
        {
            isOnboardingTooltipsEnabled = tooltipsConfiguration.IsOnboardingTooltipsEnabled,
            isTutorialTooltipsEnabled = tooltipsConfiguration.IsTutorialTooltipsEnabled,
            tutorials,
            onboardings,
        };

        return tooltips;
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
