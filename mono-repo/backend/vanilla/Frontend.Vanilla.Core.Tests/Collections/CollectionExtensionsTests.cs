using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class CollectionExtensionsTests
{
    [Theory]
    [InlineData(false, false)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(true, true)]
    public void AddTest(bool useThisList, bool testVariableParams)
    {
        var collection = useThisList ? (ICollection<int>)new List<int>() : new LinkedList<int>();
        collection.Add(1);
        collection.Add(2);

        // Act
        if (testVariableParams)
            collection.Add(3, 4, 5);
        else
            collection.Add(new List<int> { 3, 4, 5 });

        collection.Should().Equal(1, 2, 3, 4, 5);
    }
}
