using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public class DictionaryBaseTests
{
    private DictionaryBase<string, string> target;
    private Mock<DictionaryBase<string, string>> targetMock;

    public DictionaryBaseTests() => SetupTarget();

    private void SetupTarget(IEnumerable<KeyValuePair<string, string>> itemsToCopy = null, IEqualityComparer<string> keyComparer = null)
    {
        targetMock = new Mock<DictionaryBase<string, string>>(itemsToCopy, keyComparer) { CallBase = true };
        target = targetMock.Object;
    }

    [Fact]
    public void Constructor_ShouldCreateNewEmptyDictionary()
        => targetMock.Object.Should().BeEmpty();

    [Fact]
    public void Constructor_ShouldValidateAndAdaptAllItems()
    {
        var testItems = new Dictionary<string, string>
        {
            { "k1", "v1" },
            { "k2", "v2" },
        };

        SetupTarget(testItems); // Act

        targetMock.Verify(t => t.ValidateItem("k1", "v1"));
        targetMock.Verify(t => t.ValidateItem("k2", "v2"));
        target.Should().Equal(
            new Dictionary<string, string>
            {
                { "k1", "v1" },
                { "k2", "v2" },
            });
    }

    [Theory]
    [InlineData(StringComparison.OrdinalIgnoreCase, true)]
    [InlineData(StringComparison.Ordinal, false)]
    public void Constructor_ShouldUseGivenKeyComparer(StringComparison comparison, bool expectedContains)
    {
        SetupTarget(new Dictionary<string, string> { { "k", "v" } }, comparison.ToComparer()); // Act
        target.ContainsKey("K").Should().Be(expectedContains);
    }

    [Fact]
    public void ValidateItem_ShouldValidateKeyAndValue()
    {
        target.ValidateItem("k", "v"); // Act

        targetMock.Verify(t => t.ValidateKey("k"));
        targetMock.Verify(t => t.ValidateValue("v"));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void TryGetValue_ShouldValidateKey(bool isContained)
    {
        if (isContained) SetupItem("k", "v");

        var result = target.TryGetValue("k", out var value); // Act

        result.Should().Be(isContained);
        value.Should().Be(isContained ? "v" : null);
        targetMock.Verify(t => t.ValidateKey("k"));
    }

    [Fact]
    public void TryGetValue_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target.TryGetValue(null, out _));

    [Fact]
    public void IndexerGet_ShouldValidateKey()
    {
        SetupItem("k", "v");

        var result = target["k"]; // Act

        result.Should().Be("v");
        targetMock.Verify(t => t.ValidateKey("k"));
    }

    [Fact]
    public void IndexerGet_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target[null]?.ToString());

    [Fact]
    public void IndexerSet_ShouldValidateItem()
    {
        target["k"] = "v"; // Act

        targetMock.Verify(t => t.ValidateItem("k", "v"));
        target.Should().Equal(new Dictionary<string, string> { { "k", "v" } });
    }

    [Fact]
    public void IndexerSet_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target[null] = "v");

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Add_ShouldValidateItem(bool useKeyValuePair)
    {
        // Act
        if (useKeyValuePair)
            target.Add(KeyValue.Get("k", "v"));
        else
            target.Add("k", "v");

        targetMock.Verify(t => t.ValidateItem("k", "v"));
        target.Should().Equal(new Dictionary<string, string> { { "k", "v" } });
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Add_ShouldThrow_IfNullKey(bool useKeyValuePair)
        => RunNullKeyTest(useKeyValuePair
            ? () => target.Add(KeyValue.Get((string)null, "v"))
            : new Action(() => target.Add(null, "v")));

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Contains_ShouldValidateItem(bool isContained)
    {
        if (isContained) SetupItem("k", "v");

        var result = target.Contains(KeyValue.Get("k", "v")); // Act

        targetMock.Verify(t => t.ValidateItem("k", "v"));
        result.Should().Be(isContained);
    }

    [Fact]
    public void Contains_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target.Contains(KeyValue.Get((string)null, "v")));

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ContainsKey_ShouldValidateKey(bool isContained)
    {
        if (isContained) SetupItem("k", "v");

        var result = target.ContainsKey("k"); // Act

        targetMock.Verify(t => t.ValidateKey("k"));
        result.Should().Be(isContained);
    }

    [Fact]
    public void ContainsKey_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target.ContainsKey(null));

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void RemoveItem_ShouldValidateItem(bool isRemoved)
    {
        SetupItem("x", "y");
        if (isRemoved) SetupItem("k", "v");

        var result = target.Remove(KeyValue.Get("k", "v")); // Act

        result.Should().Be(isRemoved);
        targetMock.Verify(t => t.ValidateItem("k", "v"));
        target.Should().Equal(new Dictionary<string, string> { { "x", "y" } });
    }

    [Fact]
    public void RemoveItem_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target.Remove(KeyValue.Get((string)null, "v")));

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void RemoveByKey_ShouldValidateKey(bool isRemoved)
    {
        SetupItem("x", "y");
        if (isRemoved) SetupItem("k", "v");

        var result = target.Remove("k"); // Act

        result.Should().Be(isRemoved);
        targetMock.Verify(t => t.ValidateKey("k"));
        target.Should().Equal(new Dictionary<string, string> { { "x", "y" } });
    }

    [Fact]
    public void RemoveByKey_ShouldThrow_IfNullKey()
        => RunNullKeyTest(() => target.Remove(null));

    [Fact]
    public void Count_Test()
    {
        SetupItem("k", "v");
        target.Count.Should().Be(1); // Act
    }

    [Fact]
    public void IsReadOnly_Test()
        => target.IsReadOnly.Should().BeFalse(); // Act

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Keys_Test(bool callReadOnlyDictionary)
    {
        SetupItem("k1", "v1");
        SetupItem("k2", "v2");

        // Act
        var result = callReadOnlyDictionary
            ? ((IReadOnlyDictionary<string, string>)target).Keys
            : ((IDictionary<string, string>)target).Keys;

        result.Should().Equal("k1", "k2");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Values_Test(bool callReadOnlyDictionary)
    {
        SetupItem("k1", "v1");
        SetupItem("k2", "v2");

        // Act
        var result = callReadOnlyDictionary
            ? ((IReadOnlyDictionary<string, string>)target).Values
            : ((IDictionary<string, string>)target).Values;

        result.Should().Equal("v1", "v2");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void GetEnumerator_Test(bool callNonGeneric)
    {
        SetupItem("k", "v");

        // Act
        var result = callNonGeneric
            ? ((IEnumerable)target).GetEnumerator()
            : ((IEnumerable<KeyValuePair<string, string>>)target).GetEnumerator();

        result.MoveNext().Should().BeTrue();
        result.Current.Should().Be(KeyValue.Get("k", "v"));
        result.MoveNext().Should().BeFalse();
    }

    [Fact]
    public void Clear_Test()
    {
        SetupItem("k", "v");

        target.Clear(); // Act

        target.Should().BeEmpty();
    }

    [Fact]
    public void CopyTo_Test()
    {
        SetupItem("k", "v");
        var array = new KeyValuePair<string, string>[3];

        target.CopyTo(array, 1); // Act

        array.Should().Equal(default, KeyValue.Get("k", "v"), default);
    }

    private void RunNullKeyTest(Action act)
    {
        act.Should().Throw<ArgumentNullException>().Which.ParamName.Should().Be("key");
        target.Should().BeEmpty();

        targetMock.VerifyWithAnyArgs(t => t.ValidateKey(null), Times.Never);
        targetMock.VerifyWithAnyArgs(t => t.ValidateValue(null), Times.Never);
        targetMock.VerifyWithAnyArgs(t => t.ValidateItem(null, null), Times.Never);
    }

    private void SetupItem(string key, string value)
    {
        target.Add(key, value);
        targetMock.Invocations.Clear(); // To avoid calls from Add() itself
    }
}
