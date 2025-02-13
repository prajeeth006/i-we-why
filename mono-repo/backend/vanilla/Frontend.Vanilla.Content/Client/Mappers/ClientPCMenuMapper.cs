#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcMenuMapper : IClientContentMapper<IPCMenu, ClientPCMenu>
{
    public Task MapAsync(IPCMenu source, ClientPCMenu target, IClientContentContext context)
        => source.MenuNode != null
            ? MapMenuAsync(source.MenuNode, target, context)
            : Task.CompletedTask;

    private async Task MapMenuAsync(DocumentId menuId, ClientPCMenu target, IClientContentContext context)
        => target.Menu = await context.LoadMenuAsync(menuId);
}
