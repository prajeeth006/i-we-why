using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Collections;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Core.Time.Background;

/// <summary>
/// Runs background task with properly passed current context.
/// Also this eases unit testing.
/// </summary>
internal interface IBackgroundWorker
{
    Task Run(IBackgroundOperation operation);
    int RunningOperationCount { get; }
}

internal static class BackgroundWorkerExtensions
{
    public static Task Run<TArgument>(this IBackgroundWorker worker, Func<TArgument, Task> operation, TArgument arg)
        => worker.Run(new BackgroundOperation<TArgument>(operation, arg));
}

internal sealed class BackgroundWorker(
    ITask taskApi,
    IEnumerable<IBackgroundWorkInitializer> initializers,
    IExecutionContext executionContext,
    ILogger<BackgroundWorker> log)
    : IBackgroundWorker
{
    private readonly IReadOnlyList<IBackgroundWorkInitializer> initializers = initializers.ToArray();
    private volatile int runningOperationCount;

    public int RunningOperationCount => runningOperationCount;

    public Task Run(IBackgroundOperation operation)
    {
        var setupBackgroundHandlers = initializers.ConvertAll(i => i.CaptureParentContext());
        Interlocked.Increment(ref runningOperationCount);

        using (executionContext.SuppressFlow())
            return taskApi.Run(async () =>
            {
                try
                {
                    setupBackgroundHandlers.Each(h => h.Invoke());
                    await operation.ExecuteAsync();
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "Failed executing background operation with following {info}", operation.DebugInfo.Value);
                }

                Interlocked.Decrement(ref runningOperationCount);
            });
    }
}
