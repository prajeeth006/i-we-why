using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcScrollMenuMapper : IClientContentMapper<IPCScrollMenu, ClientPCScrollMenu>
{
    public Task MapAsync(IPCScrollMenu source, ClientPCScrollMenu target, IClientContentContext context)
        => source.Metadata.ChildIds.Count > 0
            ? MapItemsAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapItemsAsync(IPCScrollMenu source, ClientPCScrollMenu target, IClientContentContext context)
    {
        target.MenuItems = await context.LoadAsync(source.MenuItems);
        target.Items = await context.LoadAsync(source.Metadata.ChildIds);
    }
}
