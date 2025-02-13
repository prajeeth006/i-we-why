using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;

namespace Frontend.Vanilla.Features.ContentMessages;

internal interface IContentMessagesService
{
    Task<object> GetMessagesAsync(CancellationToken cancellationToken, string path, string closedCookieKey, bool evaluateFullOnServer = false);

    Task<object> GetMessagesAsync(CancellationToken cancellationToken, string path);
}

internal class ContentMessagesService(IContentMessagesLoader contentMessagesLoader) : IContentMessagesService
{
    public async Task<object> GetMessagesAsync(
        CancellationToken cancellationToken,
        string path,
        string closedCookieKey,
        bool evaluateFullOnServer = false)
        => await contentMessagesLoader.LoadAsync(
            $"{AppPlugin.ContentRoot}/{path}",
            closedCookieKey,
            evaluateFullOnServer ? DslEvaluation.FullOnServer : DslEvaluation.PartialForClient,
            cancellationToken);

    public async Task<object> GetMessagesAsync(CancellationToken cancellationToken, string path)
        => await contentMessagesLoader.LoadDictionaryAsync($"{AppPlugin.ContentRoot}/{path}", cancellationToken);
}
