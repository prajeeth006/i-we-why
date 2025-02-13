#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Infrastructure;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientDocumentMapper : IClientContentMapper<IDocument, ClientDocument>
{
    public Task MapAsync(IDocument source, ClientDocument target, IClientContentContext context)
    {
        target.InternalId = source.Metadata.Id.ItemName;

        return Task.CompletedTask;
    }
}
