using Frontend.Vanilla.Features.Ioc;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;

internal sealed class DynaconAppBootTask(IDynaconAppBootRestClientService dynaconRestClientService) : IBootTask
{
    public async Task ExecuteAsync()
    {
        await dynaconRestClientService.LoadAsync(default);
    }
}
