#nullable enable

using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Testing;

internal static class Wait
{
    /// <summary>
    /// Waits until specified condition is fulfilled. If not then it fails the test.
    /// By default waits for 5 seconds. Inspired by Protractor.
    /// </summary>
    public static void Until(Func<bool> condition, TimeSpan? totalWait = null, TimeSpan initialWait = default)
        => Until(() => Task.FromResult(condition()), totalWait, initialWait).Wait();

    /// <summary>
    /// Waits until specified condition is fulfilled. If not then it fails the test.
    /// By default waits for 5 seconds. Inspired by Protractor.
    /// </summary>
    public static async Task Until(Func<Task<bool>> condition, TimeSpan? totalWait = null, TimeSpan initialWait = default)
    {
        totalWait ??= initialWait + TimeSpan.FromSeconds(5);

        Guard.NotNull(condition, nameof(condition));
        Guard.GreaterOrEqual(initialWait, TimeSpan.Zero, nameof(initialWait));
        Guard.Greater(totalWait, initialWait, nameof(totalWait));

        var pollTime = TimeSpan.FromMilliseconds(20);
        var elapsedTime = initialWait;

        if (initialWait > TimeSpan.Zero)
            Thread.Sleep(initialWait);

        while (elapsedTime <= totalWait)
        {
            if (await condition())
                return;

            Thread.Sleep(pollTime);
            elapsedTime += pollTime;
        }

        throw new Exception($"Condition was not fulfilled within {totalWait}.");
    }
}
