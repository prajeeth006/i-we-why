using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class DictionaryExtensionsTests
{
    public static readonly IEnumerable<object[]> GetValueTestCases = new[]
    {
        new object[] { 0, true, 0 },
        new object[] { 666, true, 666 },
        new object[] { 666, false, 0 },
    };

    [Theory]
    [MemberData(nameof(GetValueTestCases))]
    public void GetValue_ShouldGetFromIDictionary(int v, bool isFound, int expected)
    {
        var dummy = v;
        var dict = Mock.Of<IDictionary<string, int>>(d => d.TryGetValue("key", out v) == isFound);
        dict.GetValue("key").Should().Be(expected); // Act
    }

    [Theory]
    [MemberData(nameof(GetValueTestCases))]
    public void GetValue_ShouldGetFromIReadOnlyDictionary(int v, bool isFound, int expected)
    {
        var value = v;
        var dict = Mock.Of<IReadOnlyDictionary<string, int>>(d => d.TryGetValue("key", out value) == isFound);
        dict.GetValue("key").Should().Be(expected); // Act
    }

    [Theory]
    [MemberData(nameof(GetValueTestCases))]
    public void GetValue_ShouldGetFromEnumerable(int value, bool isFound, int expected)
    {
        var enumerable = new List<KeyValuePair<string, int>> { new KeyValuePair<string, int>("other", 123) };
        if (isFound) enumerable.Add(new KeyValuePair<string, int>("key", value));
        enumerable.GetValue("key").Should().Be(expected); // Act
    }

    [Fact]
    public void GetValue_ShouldThrowIfKeyMatchesMultipleItemsInEnumerable()
    {
        var enumerable = new[] { new KeyValuePair<string, int>("key", 111), new KeyValuePair<string, int>("key", 222) };
        Assert.Throws<InvalidOperationException>(() => enumerable.GetValue("key")); // Act
    }

    [Fact]
    public void GetValue_ShouldThrowIfMultipleItemsWithSameKeyInEnumerable()
    {
        var enumerable = new[] { new KeyValuePair<string, int>("key", 111), new KeyValuePair<string, int>("key", 222) };
        Assert.Throws<InvalidOperationException>(() => enumerable.GetValue("key"));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void AddRange_ShouldAddValues(bool dictionaryOrNameValueCollection)
    {
        var target = new Dictionary<string, object>
        {
            { "k1", "v1" },
            { "k3", "v3" },
        };

        // Added collections should not be modified
        var dictionaryToAdd = new ReadOnlyDictionary<string, object>(
            new Dictionary<string, object>
            {
                { "k2", "v2" },
                { "k4", "v4" },
            });
        var nameValueCollection = new ReadOnlyNameValueCollection(
            new NameValueCollection
            {
                { "k2", "v2" },
                { "k4", "v4" },
            });

        // Act
        if (dictionaryOrNameValueCollection)
            target.Add(dictionaryToAdd);
        else
            target.Add(nameValueCollection);

        target.Select(i => i).Should().BeEquivalentTo(
            new Dictionary<string, object>
            {
                { "k1", "v1" },
                { "k3", "v3" },
                { "k2", "v2" },
                { "k4", "v4" },
            }.Select(i => i)); // Select() is called to verify order
    }

    [Theory]
    [InlineData(KeyConflictResolution.Skip, "v", true)]
    [InlineData(KeyConflictResolution.Skip, "v", false)]
    [InlineData(KeyConflictResolution.Overwrite, "overwritten", true)]
    [InlineData(KeyConflictResolution.Overwrite, "overwritten", false)]
    public void AddRange_ShouldSkipOrOverwriteIfConflict(KeyConflictResolution conflictResolution, string expected, bool dictionaryOrNameValueCollection)
    {
        var target = RunConflictTest(conflictResolution, dictionaryOrNameValueCollection);
        target.Should().BeEquivalentTo(new Dictionary<string, object> { { "k", expected } });
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void AddRange_ShouldThrowSkipOrOverwriteIfConflict(bool dictionaryOrNameValueCollection)
    {
        Action act = () => RunConflictTest(KeyConflictResolution.Throw, dictionaryOrNameValueCollection);

        act.Should().Throw<DuplicateException>()
            .Where(e => e.ConflictingValue.Equals("k"))
            .Which.Message.Should().ContainAll("Dictionary<System.String, System.Object>", "'k'", "'v'", "'overwritten'");
    }

    private IDictionary<string, object> RunConflictTest(KeyConflictResolution conflictResolution, bool dictionaryOrNameValueCollection)
    {
        var target = new Dictionary<string, object> { { "k", "v" } };
        var dictionaryToAdd = new Dictionary<string, object> { { "k", "overwritten" } };
        var nameValueCollection = new NameValueCollection { { "k", "overwritten" } };

        // Act
        if (dictionaryOrNameValueCollection)
            target.Add(dictionaryToAdd, conflictResolution);
        else
            target.Add(nameValueCollection, conflictResolution);

        return target;
    }

    [Theory]
    [InlineData(KeyConflictResolution.Skip)]
    [InlineData(KeyConflictResolution.Overwrite)]
    public void AddRange_ShouldSkipIfNameValueCollectionWithNullKey(KeyConflictResolution conflictResolution)
    {
        var target = new Dictionary<string, object>();
        target.Add(new NameValueCollection { { null, "null-v" } }, conflictResolution); // Act
        target.Should().BeEmpty();
    }

    [Fact]
    public void AddRange_ShouldThrowIfNameValueCollectionWithNullKeyAndInstructedToThrow()
    {
        var target = new Dictionary<string, object>();
        var collection = new NameValueCollection { { null, "null-v" } };

        var act = () => target.Add(collection, KeyConflictResolution.Throw);
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("NameValueCollection contains NULL key with value 'null-v' which can't be added to a dictionary contain in general");
    }

    [Theory]
    [InlineData(KeyConflictResolution.Skip)]
    [InlineData(KeyConflictResolution.Overwrite)]
    public void AddRange_ShouldAddFirstIfNameValueCollectionWithMultipleValues(KeyConflictResolution conflictResolution)
    {
        var target = new Dictionary<string, object>();
        target.Add(new NameValueCollection { { "k", "v1" }, { "k", "v2" } }, conflictResolution); // Act
        target.Should().BeEquivalentTo(new Dictionary<string, object> { { "k", "v1" } });
    }

    [Fact]
    public void AddRange_ShouldThrowIfNameValueCollectionWithMultipleValuesAndInstructedToThrow()
    {
        var target = new Dictionary<string, object>();
        var collection = new NameValueCollection { { "k", "v1" }, { "k", "v2" } };

        var act = () => target.Add(collection, KeyConflictResolution.Throw);
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("NameValueCollection contains multiple values for key 'k' but dictionary can hold only single one: v1, v2");
    }

    [Fact]
    public void AsReadOnly_ShouldWrapGivenCollection()
        => new Dictionary<string, string> { ["k1"] = "v1", ["k2"] = "v2" }.AsReadOnly().Should()
            .BeEquivalentTo(new Dictionary<string, string> { ["k1"] = "v1", ["k2"] = "v2" });

    [Fact]
    public void Remove_ShouldReturnTrueAndRemovedValue()
    {
        var target = new Dictionary<string, int> { { "k1", 111 }, { "k2", 222 } };

        var wasRemoved = target.Remove("k1", out var value); // Act

        wasRemoved.Should().BeTrue();
        value.Should().Be(111);
        target.Should().BeEquivalentTo(new Dictionary<string, int> { { "k2", 222 } });
    }

    [Fact]
    public void Remove_ShouldReturnFalse_IfValueNotContained()
    {
        var target = new Dictionary<string, int> { { "k1", 111 } };

        var wasRemoved = target.Remove("other", out var value); // Act

        wasRemoved.Should().BeFalse();
        value.Should().Be(0);
        target.Should().BeEquivalentTo(new Dictionary<string, int> { { "k1", 111 } });
    }
}
