using System;
using Frontend.Vanilla.Core.Patterns;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Patterns;

public class DisposableActionTests
{
    [Fact]
    public void DisposableAction_Works()
    {
        var counter = 0;
        var action = new DisposableAction(() => ++counter);

        action.Dispose();
        Assert.Throws<ObjectDisposedException>(() => action.Dispose());
        Assert.Equal(1, counter);
    }
}
