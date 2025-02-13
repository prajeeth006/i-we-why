#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientPmNav1ColMapper : IClientContentMapper<IPMNav1ColPage, ClientPMNav1Col>
{
    public Task MapAsync(IPMNav1ColPage source, ClientPMNav1Col target, IClientContentContext context)
        => source.Navigation.Count > 0 || source.Content.Count > 0
            ? MapPropertiesAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapPropertiesAsync(IPMNav1ColPage source, ClientPMNav1Col target, IClientContentContext context)
    {
        var navigationTask = context.LoadAsync(source.Navigation);
        target.Content = await context.LoadAsync(source.Content);
        target.Navigation = await navigationTask; // Run the task in parallel
    }
}
