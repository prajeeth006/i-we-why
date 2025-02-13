#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcImageMapper : IClientContentMapper<IPCImage, ClientPCImage>
{
    public Task MapAsync(IPCImage source, ClientPCImage target, IClientContentContext context)
    {
        target.Image = source.Image;
        target.ImageLink = source.ImageLink;
        target.ToolTip = source.ToolTip;
        target.IconName = source.IconName;

        return Task.CompletedTask;
    }
}
