#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPm1ColMapper : IClientContentMapper<IPM1ColPage, ClientPM1Col>
{
    public Task MapAsync(IPM1ColPage source, ClientPM1Col target, IClientContentContext context)
        => source.Content.Count > 0
            ? MapContentAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapContentAsync(IPM1ColPage source, ClientPM1Col target, IClientContentContext context)
        => target.Content = await context.LoadAsync(source.Content);
}
