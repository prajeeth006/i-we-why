using System;
using System.Collections.Specialized;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class NameValueCollectionExtensionsTests
{
    [Fact]
    public void AsReadOnly_ShouldCreateReadOnlyCollection()
    {
        var collection = new NameValueCollection { { "k", "v" } };

        // Act
        var result = collection.AsReadOnly();

        result.Should().BeEquivalentTo(new NameValueCollection { { "k", "v" } });
        result.Should().BeOfType<ReadOnlyNameValueCollection>();
    }

    [Fact]
    public void AsReadOnly_ShouldReturnSameIfAlreadyReadOnly()
    {
        var collection = new ReadOnlyNameValueCollection(new NameValueCollection { { "k", "v" } });
        collection.AsReadOnly().Should().BeSameAs(collection);
    }

    [Theory]
    [InlineData("k", StringComparison.OrdinalIgnoreCase, true)]
    [InlineData("K", StringComparison.OrdinalIgnoreCase, true)]
    [InlineData("K", StringComparison.Ordinal, false)]
    [InlineData("not-contained", StringComparison.OrdinalIgnoreCase, false)]
    [InlineData(null, StringComparison.OrdinalIgnoreCase, true)]
    [InlineData("null-k", StringComparison.OrdinalIgnoreCase, true)]
    public void ContainsKey_Test(string key, StringComparison keyComparison, bool expected)
    {
        var collection = new NameValueCollection
        {
            { "k", "v" },
            { null, "null-v" },
            { "null-k", null },
        };
        collection.ContainsKey(key, keyComparison).Should().Be(expected);
    }

    [Theory]
    [InlineData(KeyConflictResolution.Overwrite)]
    [InlineData(KeyConflictResolution.Skip)]
    [InlineData(KeyConflictResolution.Throw)]
    public void Add_Test(KeyConflictResolution conflictResolution)
    {
        var collection = new NameValueCollection
        {
            { "k1", "v1" },
        };
        var itemsToAdd = new NameValueCollection
        {
            { null, "null-v" },
            { "null-k", null },
            { "k2", "v2.1" },
            { "k2", "v2.2" },
        };

        // Act
        collection.Add(itemsToAdd, conflictResolution);

        collection.AllKeys.Should().BeEquivalentTo(new[] { "k1", "k2", "null-k", null });
        collection["k1"].Should().Be("v1");
        collection[null].Should().Be("null-v");
        collection["null-k"].Should().Be(null);
        collection.GetValues("k2").Should().BeEquivalentTo("v2.1", "v2.2");
    }

    [Theory]
    [InlineData(KeyConflictResolution.Skip, "v")]
    [InlineData(KeyConflictResolution.Overwrite, "overwritten")]
    public void Add_ShouldSkipOrOverwriteIfConflict(KeyConflictResolution conflictResolution, string expected)
    {
        var collection = new NameValueCollection { { "k", "v" } };
        collection.Add(new NameValueCollection { { "k", "overwritten" } }, conflictResolution); // Act
        collection["k"].Should().Be(expected);
    }

    [Fact]
    public void Add_ShouldThrowIfConflict()
    {
        var collection = new NameValueCollection { { "k", "v" } };

        var act = () => collection.Add(new NameValueCollection { { "k", "x" } }, KeyConflictResolution.Throw);
        act.Should().Throw<InvalidOperationException>().WithMessage("Target collection already contains an entry with key 'k'. Existing value: 'v' vs. attempted: 'x'");
    }

    [Theory]
    [InlineData(true, "true")]
    [InlineData(true, "True")]
    [InlineData(false, "false")]
    [InlineData(false, "")]
    [InlineData(false, null)]
    public void GetBoolean_Test(bool expected, string inputValue)
    {
        var collection = new NameValueCollection { { "param", inputValue } };
        collection.GetBoolean("param").Should().Be(expected);
    }

    [Fact]
    public void GetBoolean_ShouldThrowIfInvalidInput()
    {
        var collection = new NameValueCollection { { "param", "not boolean" } };

        Action act = () => collection.GetBoolean("param");
        act.Should().Throw<InvalidOperationException>().WithMessage("Unable to parse boolean from value 'not boolean' stored by key 'param'");
    }
}
