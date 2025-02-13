#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.Client.Mappers;

internal sealed class ClientProxyMapper : IClientContentMapper<IProxy, ClientProxy>
{
    public Task MapAsync(IProxy source, ClientProxy target, IClientContentContext context)
        => source.Target.Count > 0
            ? MapRulesAsync(source, target, context)
            : Task.CompletedTask;

    private static async Task MapRulesAsync(IProxy source, ClientProxy target, IClientContentContext context)
        => target.Rules = await Task.WhenAll(source.Target.ConvertAll(async rule =>
        {
            var document = rule.TargetId != null ? await context.LoadAsync(rule.TargetId) : null;

            return new ClientProxyRule { Condition = rule.Condition, Document = document };
        }));
}
