#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientFolderMapper : IClientContentMapper<IFolder, ClientFolder>
{
    public Task MapAsync(IFolder source, ClientFolder target, IClientContentContext context)
    {
        target.Name = source.Metadata.Id.ItemName;

        return source.Metadata.ChildIds.Count > 0
            ? MapItemsAsync(source, target, context)
            : Task.CompletedTask;
    }

    private async Task MapItemsAsync(IFolder source, ClientFolder target, IClientContentContext context)
        => target.Items = await context.LoadAsync(source.Metadata.ChildIds);
}
