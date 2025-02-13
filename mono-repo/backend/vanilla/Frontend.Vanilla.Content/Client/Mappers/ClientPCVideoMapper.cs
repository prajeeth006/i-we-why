#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcVideoMapper : IClientContentMapper<IPCVideo, ClientPCVideo>
{
    public Task MapAsync(IPCVideo source, ClientPCVideo target, IClientContentContext context)
    {
        target.Video = source.Video;
        target.Controls = source.Controls;

        return Task.CompletedTask;
    }
}
