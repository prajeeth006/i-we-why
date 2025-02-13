using System;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Utilities for testing behavior of code if run concurrently from more threads.
/// </summary>
public static class ConcurrencyTest
{
    /// <summary>
    ///     Runs given <paramref name="action" /> concurrently by specified count of threads.
    /// </summary>
    /// <param name="threadCount">Amount of threads that should execute the action.</param>
    /// <param name="action">
    ///     The action to be executed by all threads. Parameter passed to the action is zero-based index of
    ///     the thread.
    /// </param>
    public static void Run(int threadCount, Action<int> action)
    {
        // Create tasks first and start them afterwards at once in order to achieve more concurrent execution
        var tasks = Enumerable
            .Range(0, threadCount)
            .Select(i => new Task(() => action.Invoke(i)))
            .ToArray();

        foreach (var task in tasks)
            task.Start();

        Task.WaitAll(tasks);
    }
}
