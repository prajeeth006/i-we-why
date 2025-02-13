#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPm2ColMapper : IClientContentMapper<IPM2ColPage, ClientPM2Col>
{
    public Task MapAsync(IPM2ColPage source, ClientPM2Col target, IClientContentContext context)
        => source.ContentRight.Count > 0 || source.ContentLeft.Count > 0
            ? MapPropertiesAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapPropertiesAsync(IPM2ColPage source, ClientPM2Col target, IClientContentContext context)
    {
        var contentRightTask = context.LoadAsync(source.ContentRight);
        target.ContentLeft = await context.LoadAsync(source.ContentLeft);
        target.ContentRight = await contentRightTask; // Run the task in parallel
    }
}
