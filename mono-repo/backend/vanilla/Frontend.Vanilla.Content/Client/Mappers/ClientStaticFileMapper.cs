#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientStaticFileMapper : IClientContentMapper<IStaticFileTemplate, ClientStaticFileTemplate>
{
    public Task MapAsync(IStaticFileTemplate source, ClientStaticFileTemplate target, IClientContentContext context)
    {
        target.InternalId = source.Metadata.Id.ItemName;
        target.Content = context.CreateText(source.Content);

        return Task.CompletedTask;
    }
}
