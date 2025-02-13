#nullable enable
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Loading.ProxyFolder;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientProxyFolderMapper : IClientContentMapper<IVanillaProxyFolder, ClientProxy>
{
    public Task MapAsync(IVanillaProxyFolder source, ClientProxy target, IClientContentContext context)
        => source.Target.Count > 0
            ? MapRulesAsync(source, target, context)
            : Task.CompletedTask;

    private async Task MapRulesAsync(IVanillaProxyFolder source, ClientProxy target, IClientContentContext context)
        => target.Rules = await Task.WhenAll(source.Target.ConvertAll(async rule => new ClientProxyRule
            { Condition = rule.Condition, Document = await context.ConvertAsync(rule.Document) }));
}
