using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public sealed class LockExtensionsTests
{
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task ShouldWaitAndReleaseAfterwards(bool isAsync)
    {
        var mode = isAsync ? TestExecutionMode.Get() : ExecutionMode.Sync;
        var semaphore = new SemaphoreSlim(initialCount: 666);

        // Act
        var task = semaphore.WaitDisposableAsync(mode);

        var disposable = isAsync ? await task : ExecutionMode.ExecuteSync(task);
        semaphore.CurrentCount.Should().Be(665);

        disposable.Dispose();
        semaphore.CurrentCount.Should().Be(666);
    }

    [Fact]
    public void TakeRead_ShouldLockForRead()
    {
        var @lock = new ReaderWriterLockSlim();

        using (@lock.TakeRead())
        {
            @lock.IsReadLockHeld.Should().BeTrue();
            @lock.IsWriteLockHeld.Should().BeFalse();
        }

        @lock.IsReadLockHeld.Should().BeFalse();
    }

    [Fact]
    public void TakeWrite_ShouldLockForWrite()
    {
        var @lock = new ReaderWriterLockSlim();

        using (@lock.TakeWrite())
        {
            @lock.IsWriteLockHeld.Should().BeTrue();
            @lock.IsReadLockHeld.Should().BeFalse();
        }

        @lock.IsWriteLockHeld.Should().BeFalse();
    }
}
