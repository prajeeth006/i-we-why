#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPmBasePageMapper : IClientContentMapper<IPMBasePage, ClientPMBasePage>
{
    public Task MapAsync(IPMBasePage source, ClientPMBasePage target, IClientContentContext context)
    {
        target.TemplateName = source.Metadata.TemplateName;
        target.PageClass = context.CreateText(source.PageClass);
        target.PageId = context.CreateText(source.PageId);
        target.PageTitle = context.CreateText(source.PageTitle);
        target.PageDescription = context.CreateText(source.PageDescription);
        target.PageMetaTags = context.CreateOptionalCollection(source.PageMetaTags);
        target.Parameters = context.CreateOptionalCollection(source.Parameters);

        return Task.CompletedTask;
    }
}
