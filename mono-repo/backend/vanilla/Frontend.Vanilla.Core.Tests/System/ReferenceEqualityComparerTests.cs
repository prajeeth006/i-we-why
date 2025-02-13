using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ReferenceEqualityComparerTests
{
    [Fact]
    public void ShouldBeEqualIfSameInstances()
    {
        var obj = new object();
        Assert.Equal(obj, obj, ReferenceEqualityComparer.Singleton);
    }

    [Fact]
    public void ShouldNotBeEqualIfDifferentInstances()
    {
        var obj1 = new object();
        var obj2 = new object();

        Assert.NotEqual(obj1, obj2, ReferenceEqualityComparer.Singleton);
    }
}
