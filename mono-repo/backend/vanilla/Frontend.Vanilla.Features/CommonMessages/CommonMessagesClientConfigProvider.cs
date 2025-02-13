using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.CommonMessages;

internal sealed class CommonMessagesClientConfigProvider(IContentService contentService) : LambdaClientConfigProvider("vnCommonMessages",
    async ct =>
    {
        var content = await contentService.GetRequiredAsync<IViewTemplate>(AppPlugin.ContentRoot + "/Common/Messages", ct);

        return content.Messages;
    }) { }
