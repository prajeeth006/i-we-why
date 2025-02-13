using System;
using System.Collections.Specialized;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public class ReadOnlyNameValueCollectionTests
{
    [Fact]
    public void Empty_Test()
        => ReadOnlyNameValueCollection.Empty.Count.Should().Be(0);

    [Fact]
    public void Constructor_Test()
    {
        // Act
        var collection = new ReadOnlyNameValueCollection(new NameValueCollection { { "a", "b" }, { "c", "d" } });

        collection.Keys.Should().BeEquivalentTo(new[] { "a", "c" });
        collection["a"].Should().Be("b");
        collection["c"].Should().Be("d");
        Assert.Throws<NotSupportedException>(() => collection.Add("key", "value"));
        Assert.Throws<NotSupportedException>(() => collection["a"] = "test");
        Assert.Throws<NotSupportedException>(() => collection.Set("a", "test"));
        Assert.Throws<NotSupportedException>(() => collection.Remove("a"));
        Assert.Throws<NotSupportedException>(() => collection.Clear());
    }
}
