using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Patterns;

public class DisposableTests
{
    internal class TestDisposable : Disposable
    {
        internal int DisposeCallCount { get; private set; }

        protected override void OnDispose()
        {
            DisposeCallCount++;
        }
    }

    [Fact]
    public void OnDisposeShouldBeCalled()
    {
        var disposable = new TestDisposable();
        disposable.Dispose();

        disposable.DisposeCallCount.Should().Be(1);
    }

    [Fact]
    public void MultipleDisposeCallsShouldThrow()
    {
        var disposable = new TestDisposable();
        disposable.Dispose();

        Assert.Throws<ObjectDisposedException>(() => disposable.Dispose());
    }

    [Fact]
    public void IsDisposedShouldReflectState()
    {
        var disposable = new TestDisposable();
        Assert.False(disposable.IsDisposed);

        disposable.Dispose();

        Assert.True(disposable.IsDisposed);
    }

    [Fact]
    public void DisposableShouldBeThreadSafe()
    {
        // TODO: Not a really deterministic test, should wait for a new Microsoft CHESS release [hd][30012011]
        const int runCount = 1000 * 100;

        var exceptionCount = 0;
        var disposable = new TestDisposable();

        Parallel.For(
            0,
            runCount,
            i =>
            {
                try
                {
                    disposable.Dispose();
                }
                catch (ObjectDisposedException)
                {
                    Interlocked.Increment(ref exceptionCount);
                }
            });

        disposable.DisposeCallCount.Should().Be(1);
        exceptionCount.Should().Be(runCount - 1);
    }
}
