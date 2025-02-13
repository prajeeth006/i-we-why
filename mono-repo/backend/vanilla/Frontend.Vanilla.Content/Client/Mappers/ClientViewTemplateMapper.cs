#nullable enable

using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientViewTemplateMapper : IClientContentMapper<IViewTemplate, ClientViewTemplate>
{
    public Task MapAsync(IViewTemplate source, ClientViewTemplate target, IClientContentContext context)
    {
        target.InternalId = source.Metadata.Id.ItemName;
        target.Title = context.CreateText(source.Title);
        target.Text = context.CreateText(source.Text);
        target.Messages = context.CreateOptionalCollection(source.Messages);
        target.Validation = context.CreateOptionalCollection(source.Validation);

        return source.Metadata.ChildIds.Count > 0
            ? MapChildrenAsync(source, target, context)
            : Task.CompletedTask;
    }

    private async Task MapChildrenAsync(IViewTemplate source, ClientViewTemplate target, IClientContentContext context)
    {
        var allChildren = await context.LoadAsync(source.Metadata.ChildIds);

        target.Form = allChildren.OfType<ClientFormElement>().ToDictionary(c => c.Id ?? "");
        target.Links = allChildren.OfType<ClientLinkTemplate>().ToDictionary(c => c.InternalId?.ItemName ?? "");
        target.Children = allChildren.Where(c => c is ClientViewTemplate or ClientPCBaseComponent).ToDictionary(c => c.InternalId?.ItemName ?? "");
        target.Proxy = allChildren.OfType<ClientProxy>().ToDictionary(c => c.InternalId?.ItemName ?? "");
    }
}
