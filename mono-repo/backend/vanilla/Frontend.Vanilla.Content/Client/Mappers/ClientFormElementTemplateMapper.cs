#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientFormElementTemplateMapper : IClientContentMapper<IFormElementTemplate, ClientFormElement>
{
    public Task MapAsync(IFormElementTemplate source, ClientFormElement target, IClientContentContext context)
    {
        target.Id = source.Metadata.Id.ItemName;
        target.Label = context.CreateText(source.Label);
        target.ToolTip = context.CreateText(source.ToolTip);
        target.Validation = context.CreateOptionalCollection(source.Validation);
        target.Values = context.CreateListItemCollection(source.Values);
        target.Watermark = context.CreateText(source.Watermark);
        target.HtmlAttributes = context.CreateOptionalCollection(source.HtmlAttributes);

        return Task.CompletedTask;
    }
}
