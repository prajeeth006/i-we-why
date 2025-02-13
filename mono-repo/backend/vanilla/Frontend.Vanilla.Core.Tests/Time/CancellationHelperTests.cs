using System;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Core.Time;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Time;

public class CancellationHelperTests
{
    private readonly ICancellationHelper target;
    private readonly CancellationTokenSource linkedCts;
    private TimeSpan delay;

    public CancellationHelperTests()
    {
        target = new CancellationHelper();
        linkedCts = new CancellationTokenSource();
        delay = TimeSpan.FromSeconds(10);
    }

    private ICancellation GetCancellation()
        => target.CancelAfter(delay, linkedCts.Token);

    [Fact]
    public void ShouldCancel_IfLinkedTokenCanceled()
    {
        var cancellation = GetCancellation();
        cancellation.Token.IsCancellationRequested.Should().BeFalse();

        // Act
        linkedCts.Cancel();

        cancellation.Token.IsCancellationRequested.Should().BeTrue();
    }

    [Fact]
    public void ShouldDisposeCorrectly()
    {
        var cancellation = GetCancellation();

        // Act
        cancellation.Dispose();

        cancellation.Invoking(c => c.Token.WaitHandle).Should().Throw<ObjectDisposedException>();
    }
}
