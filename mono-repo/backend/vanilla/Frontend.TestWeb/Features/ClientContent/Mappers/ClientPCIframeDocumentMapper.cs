using Frontend.TestWeb.Features.ClientContent.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.TestWeb.Features.ClientContent.Mappers;

public class ClientPCIFrameMapper : IClientContentMapper<IPCIFrame, ClientPCIFrameDocument>
{
    public Task MapAsync(IPCIFrame source, ClientPCIFrameDocument target, IClientContentContext context)
    {
        target.Src = source.Src?.Url;
        target.Width = source.Width;
        target.Height = source.Height;

        return Task.CompletedTask;
    }
}
