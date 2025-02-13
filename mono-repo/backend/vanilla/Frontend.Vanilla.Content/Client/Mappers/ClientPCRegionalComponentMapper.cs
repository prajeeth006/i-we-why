#nullable enable

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcRegionalComponentMapper(IClientContentRegionalResolver clientContentRegionalResolver)
    : IClientContentMapper<IPCRegionalComponent, ClientPCRegionalComponent>
{
    public Task MapAsync(IPCRegionalComponent source, ClientPCRegionalComponent target, IClientContentContext context)
    {
        var regionIds = clientContentRegionalResolver.Resolve(source.RegionItems).ToList();

        return regionIds.Count > 0
            ? MapItemAsync(regionIds, target, context)
            : Task.CompletedTask;
    }

    private async Task MapItemAsync(IReadOnlyList<DocumentId> regionIds, ClientPCRegionalComponent target, IClientContentContext context)
    {
        foreach (var regionId in regionIds)
        {
            var item = await context.LoadAsync(regionId);

            if (item != null)
            {
                target.Item = item;

                break;
            }
        }
    }
}
