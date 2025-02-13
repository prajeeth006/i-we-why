using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.RememberMeLogoutPrompt;

internal sealed class RememberMeLogoutPromptClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider(
    "vnRememberMeLogoutPrompt", async cancellationToken =>
    {
        var content = await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/RememberMe/LogoutPrompt",
            cancellationToken,
            new ContentLoadOptions { DslEvaluation = DslEvaluation.PartialForClient });

        return new
        {
            content,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
