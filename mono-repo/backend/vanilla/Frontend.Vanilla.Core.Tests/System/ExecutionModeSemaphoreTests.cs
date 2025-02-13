using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ExecutionModeSemaphoreTests : IAsyncLifetime
{
    private ExecutionModeSemaphore target;
    private IDictionary<object, Lazy<object>> syncItems;
    private IDisposable firstLock;
    private const int TimeoutMillis = 10_000;

    async ValueTask IAsyncLifetime.InitializeAsync()
    {
        target = new ExecutionModeSemaphore();
        syncItems = new ConcurrentDictionary<object, Lazy<object>>();

        firstLock = await target.WaitDisposableAsync(ExecutionMode.Async(default), syncItems);
    }

    ValueTask IAsyncDisposable.DisposeAsync()
        => ValueTask.CompletedTask;

    [RetryFact]
    public async Task ShouldThrow_IfAsyncEnteredAndSyncAboutToEnter_FromSameFlow()
    {
        Func<Task> act = () => target.WaitDisposableAsync(ExecutionMode.Sync, syncItems); // Act

        (await act.Should().ThrowAsync<InvalidOperationException>()).Which.Message.Should().Contain("deadlock");
    }

    [RetryFact]
    public async Task ShouldPass_IfSyncCallFromDifferentFlows()
        => await RunPassTest(ExecutionMode.Sync, new ConcurrentDictionary<object, Lazy<object>>()); // Different items = different flow

    [RetryFact]
    public async Task ShouldPass_IfAsyncCalls_FromSameFlow()
        => await RunPassTest(ExecutionMode.Async(default), syncItems);

    private async Task RunPassTest(ExecutionMode mode, IDictionary<object, Lazy<object>> syncItemsToTest)
    {
        await Task.Delay(0);
        var status = "NotStarted";

#pragma warning disable 4014
        Task.Run(async () =>
#pragma warning restore 4014
        {
            status = "Entering";
            await target.WaitDisposableAsync(mode, syncItemsToTest); // Act
            status = "Entered";
        });

        WaitForStatus("Entering");
        firstLock.Dispose();
        WaitForStatus("Entered");

        void WaitForStatus(string expected)
            => Wait.Until(() => status == expected, TimeSpan.FromMilliseconds(TimeoutMillis));
    }
}
