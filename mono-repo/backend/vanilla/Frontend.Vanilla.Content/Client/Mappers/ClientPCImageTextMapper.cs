#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcImageTextMapper : IClientContentMapper<IPCImageText, ClientPCImageText>
{
    public Task MapAsync(IPCImageText source, ClientPCImageText target, IClientContentContext context)
    {
        target.Image = source.Image;
        target.ImageLink = source.ImageLink;
        target.Text = context.CreateText(source.Text);

        return Task.CompletedTask;
    }
}
