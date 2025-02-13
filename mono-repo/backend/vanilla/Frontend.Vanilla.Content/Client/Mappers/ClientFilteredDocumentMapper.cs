#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientFilteredDocumentMapper : IClientContentMapper<IFilterTemplate, ClientFilteredDocument>
{
    public Task MapAsync(IFilterTemplate source, ClientFilteredDocument target, IClientContentContext context)
    {
        target.Condition = context.CreateText(source.Condition);

        return Task.CompletedTask;
    }
}
