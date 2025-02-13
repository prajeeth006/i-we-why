using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Features.LanguageSwitcher;

namespace Frontend.Vanilla.Features.Footer;

internal sealed class FooterClientConfigProvider(
    IFooterConfiguration config,
    IContentService contentService,
    IContentMessagesLoader contentMessagesLoader,
    IMenuFactory menuFactory,
    ILanguageSwitcherConfiguration languageSwitcherConfiguration)
    : LambdaClientConfigProvider("vnFooter", async cancellationToken =>
    {
        var linksTask = menuFactory.GetSectionAsync($"{AppPlugin.ContentRoot}/Footer2/Links", DslEvaluation.PartialForClient, cancellationToken);
        var seoLinksTask = menuFactory.GetSectionsAsync($"{AppPlugin.ContentRoot}/Footer2/SEOLinks", DslEvaluation.PartialForClient, cancellationToken);
        var leftLogosTask = menuFactory.GetOptionalSectionAsync($"{AppPlugin.ContentRoot}/Footer2/Logos/Left", DslEvaluation.PartialForClient, cancellationToken);
        var rightLogosTask = menuFactory.GetOptionalSectionAsync($"{AppPlugin.ContentRoot}/Footer2/Logos/Right", DslEvaluation.PartialForClient, cancellationToken);
        var contentMessagesTask =
            contentMessagesLoader.LoadAsync($"{AppPlugin.ContentRoot}/Footer2/ContentMessages", "vn-f", DslEvaluation.PartialForClient, cancellationToken);
        var copyrightTask = contentService.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Footer2/Copyright",
            cancellationToken,
            new ContentLoadOptions { DslEvaluation = DslEvaluation.PartialForClient, RequireTranslation = true });
        var helpButtonTask = menuFactory.GetItemAsync($"{AppPlugin.ContentRoot}/Footer2/HelpButton", DslEvaluation.PartialForClient, cancellationToken);
        var showLanguageSwitcherTask = languageSwitcherConfiguration.IsEnabledDslExpression.EvaluateForClientAsync(cancellationToken);
        var topItemsTask = contentMessagesLoader.LoadAsync($"{AppPlugin.ContentRoot}/Footer2/TopItems/Regulatory",
            "vn-f",
            DslEvaluation.PartialForClient,
            cancellationToken);
        var links = await linksTask;
        var seoLinks = await seoLinksTask;
        var logos = new { left = await leftLogosTask, right = await rightLogosTask };
        var contentMessages = await contentMessagesTask;
        var copyright = await copyrightTask;
        var helpButton = await helpButtonTask;
        var showLanguageSwitcherDslCondition = await showLanguageSwitcherTask;
        var isEnabledCondition = await config.Enabled.EvaluateForClientAsync(cancellationToken);
        var footerTopItems = await topItemsTask;

        return new
        {
            isEnabledCondition,
            config.ExpandableModeEnabled,
            config.ExpandableModeIcons,
            config.ShowHelpButton,
            config.ShowLabelSwitcher,
            links,
            seoLinks,
            logos,
            contentMessages,
            copyright,
            showLanguageSwitcherDslCondition,
            helpButton,
            footerTopItems,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
