#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcBaseComponentMapper : IClientContentMapper<IPCBaseComponent, ClientPCBaseComponent>
{
    public Task MapAsync(IPCBaseComponent source, ClientPCBaseComponent target, IClientContentContext context)
    {
        target.TemplateName = source.Metadata.TemplateName;
        target.Name = source.Metadata.Id.ItemName;
        target.Class = context.CreateText(source.Class);
        target.Title = context.CreateText(source.Title);
        target.TitleLink = source.TitleLink;
        target.Parameters = context.CreateOptionalCollection(source.Parameters);

        return Task.CompletedTask;
    }
}
