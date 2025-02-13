#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcTeaserMapper : IClientContentMapper<IPCTeaser, ClientPCTeaser>
{
    public Task MapAsync(IPCTeaser source, ClientPCTeaser target, IClientContentContext context)
    {
        target.Image = source.Image;
        target.ImageLink = source.ImageLink;
        target.ImageOverlay = source.ImageOverlay;
        target.ImageOverlayClass = context.CreateText(source.ImageOverlayClass);
        target.Text = context.CreateText(source.Text);
        target.Subtitle = context.CreateText(source.Subtitle);
        target.Summary = context.CreateText(source.Summary);
        target.OptionalText = context.CreateText(source.OptionalText);

        return Task.CompletedTask;
    }
}
