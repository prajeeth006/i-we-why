#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientLinkTemplateMapper : IClientContentMapper<ILinkTemplate, ClientLinkTemplate>
{
    public Task MapAsync(ILinkTemplate source, ClientLinkTemplate target, IClientContentContext context)
    {
        target.Url = source.Url;
        target.LinkText = context.CreateText(source.LinkText);
        target.HtmlAttributes = context.CreateOptionalCollection(source.HtmlAttributes);

        return Task.CompletedTask;
    }
}
