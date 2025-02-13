#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcComponentFolderMapper : IClientContentMapper<IPCComponentFolder, ClientPCComponentFolder>
{
    public Task MapAsync(IPCComponentFolder source, ClientPCComponentFolder target, IClientContentContext context)
        => source.Metadata.ChildIds.Count > 0
            ? MapItemsAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapItemsAsync(IPCComponentFolder source, ClientPCComponentFolder target, IClientContentContext context)
    {
        target.MaxItems = source.MaxItems;
        target.Items = await context.LoadAsync(source.Metadata.ChildIds);
    }
}
