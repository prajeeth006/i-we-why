using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Ioc;

/// <summary>
/// Manages the boot task execution step of the Web application bootstrap process,
/// by executing all registered boot tasks.
/// </summary>
internal interface IBootTaskExecutor
{
    Task ExecuteTasksAsync();
}

internal sealed class BootTaskExecutor(IEnumerable<IBootTask> bootTasks, ILogger<BootTaskExecutor> log) : IBootTaskExecutor
{
    private IReadOnlyList<IBootTask>? bootTasks = bootTasks.OrderByDescending(IsVanillaTask).ToList();

    public async Task ExecuteTasksAsync()
    {
        if (bootTasks == null)
            throw new InvalidOperationException("Boot tasks have been already executed.");

        log.LogInformation("START BootTask execution");

        foreach (var task in bootTasks)
        {
            log.LogInformation("Executing boot task of {type}", task.GetType().ToString());
            await task.ExecuteAsync();
        }

        bootTasks = null;
        log.LogInformation("END BootTask execution");
    }

    private static bool IsVanillaTask(IBootTask bootTask)
        => bootTask.GetType().Namespace?.StartsWith("Frontend.Vanilla") == true;
}
