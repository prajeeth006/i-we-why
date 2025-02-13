#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPcTextMapper : IClientContentMapper<IPCText, ClientPCText>
{
    public Task MapAsync(IPCText source, ClientPCText target, IClientContentContext context)
    {
        target.Text = context.CreateText(source.Text);

        return Task.CompletedTask;
    }
}
