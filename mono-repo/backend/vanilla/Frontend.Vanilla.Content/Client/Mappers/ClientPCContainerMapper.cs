#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcContainerMapper : IClientContentMapper<IPCContainer, ClientPCContainer>
{
    public Task MapAsync(IPCContainer source, ClientPCContainer target, IClientContentContext context)
        => source.Items.Count > 0
            ? MapItemsAsync(source, target, context)
            : Task.CompletedTask;

    public async Task MapItemsAsync(IPCContainer source, ClientPCContainer target, IClientContentContext context)
        => target.Items = await context.LoadAsync(source.Items);
}
