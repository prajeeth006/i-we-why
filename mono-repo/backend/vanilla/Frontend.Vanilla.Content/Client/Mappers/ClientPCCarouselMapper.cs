#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcCarouselMapper : IClientContentMapper<IPCCarousel, ClientPCCarousel>
{
    public Task MapAsync(IPCCarousel source, ClientPCCarousel target, IClientContentContext context)
        => source.Metadata.ChildIds.Count > 0
            ? MapItemsAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapItemsAsync(IPCCarousel source, ClientPCCarousel target, IClientContentContext context)
    {
        target.MaxItems = source.MaxItems;
        target.Items = await context.LoadAsync(source.Metadata.ChildIds);
    }
}
