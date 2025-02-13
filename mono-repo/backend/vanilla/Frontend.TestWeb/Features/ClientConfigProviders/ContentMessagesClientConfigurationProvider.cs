using Frontend.Vanilla.Content;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.ContentMessages;

namespace Frontend.TestWeb.Features.ClientConfigProviders;

internal class ContentMessagesClientConfigurationProvider(IContentMessagesLoader messagesLoader) : LambdaClientConfigProvider("m2PlaygroundContentMessages",
    async cancellationToken =>
        await messagesLoader.LoadAsync(PlaygroundPlugin.ContentRoot + "/ContentMessages", "pg-test", DslEvaluation.PartialForClient, cancellationToken)) { }
