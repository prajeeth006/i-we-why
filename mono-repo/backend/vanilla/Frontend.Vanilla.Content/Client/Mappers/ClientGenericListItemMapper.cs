#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientGenericListItemMapper : IClientContentMapper<IGenericListItem, ClientGenericListItem>
{
    public Task MapAsync(IGenericListItem source, ClientGenericListItem target, IClientContentContext context)
    {
        target.Messages = new Dictionary<string, string?>(ContentParameters.Comparer)
        {
            source.SharedList,
            { source.VersionedList, KeyConflictResolution.Overwrite },
        }.AsContentParameters();

        return Task.CompletedTask;
    }
}
