using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching.Isolation;

public sealed class MemoryCacheIsolationTests
{
    private IsolatedMemoryCache target;
    private Mock<IMemoryCache> inner;
    private Mock<Func<object, object>> getIsolationPrefix;
    private object testIsolationPrefix;
    private object testCallerKey;

    public MemoryCacheIsolationTests()
    {
        inner = new Mock<IMemoryCache>();
        getIsolationPrefix = new Mock<Func<object, object>>();
        target = new IsolatedMemoryCache(inner.Object, getIsolationPrefix.Object);

        testIsolationPrefix = "isolation-" + Guid.NewGuid();
        testCallerKey = "key-" + Guid.NewGuid();
        getIsolationPrefix.SetupWithAnyArgs(g => g(null)).Returns(testIsolationPrefix);
    }

    [Fact]
    public void Constructor_ShouldSetProperties()
    {
        target.Inner.Should().BeSameAs(inner.Object);
        target.GetKeyPrefix.Should().BeSameAs(getIsolationPrefix.Object);
    }

    [Fact]
    public void IsolateBy_ShouldPassParameters()
    {
        target = (IsolatedMemoryCache)inner.Object.IsolateBy(getIsolationPrefix.Object); // Act
        Constructor_ShouldSetProperties();
    }

    [Fact]
    public void IsolateBy_ShouldSupportStaticValue()
    {
        target = (IsolatedMemoryCache)inner.Object.IsolateBy("static"); // Act

        target.Inner.Should().BeSameAs(inner.Object);
        target.GetKeyPrefix("whatever").Should().Be("static");
    }

    [Fact]
    public void Dispose_ShouldCallInnerDispose()
    {
        target.Dispose(); // Act

        inner.Verify(o => o.Dispose());
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void TryGetValue_ShouldCallInnerTryGetValue(bool isCacheHit)
    {
        object testValue = isCacheHit ? "testValue" : null;
        inner.Setup(o => o.TryGetValue(Tuple.Create(testIsolationPrefix, testCallerKey), out testValue)).Returns(isCacheHit);

        var success = target.TryGetValue(testCallerKey, out var result); // Act

        success.Should().Be(isCacheHit);
        result.Should().Be(testValue);
        VerifyGetIsolationPrefix();
    }

    [Fact]
    public void CreateEntry_ShouldReturnWrappedEntry()
    {
        var innerEntry = new Mock<ICacheEntry>();
        inner.SetupWithAnyArgs(o => o.CreateEntry(null)).Returns(innerEntry.Object);

        var entry = target.CreateEntry(testCallerKey); // Act

        entry.Should().BeAssignableTo<MemoryCacheEntryDecorator>()
            .Which.Inner.Should().BeSameAs(innerEntry.Object);
        entry.Key.Should().Be(testCallerKey);

        inner.Verify(o => o.CreateEntry(Tuple.Create(testIsolationPrefix, testCallerKey)));
        VerifyGetIsolationPrefix();
        innerEntry.Verify(e => e.Dispose(), Times.Never);
    }

    [Fact]
    public void EntryDispose_ShouldCopyProperties()
    {
        var expirationToken = Mock.Of<IChangeToken>();
        var testEvicationCallback = new Mock<PostEvictionDelegate>();
        var innerEntry = new Mock<ICacheEntry>();
        innerEntry.SetupGet(o => o.PostEvictionCallbacks).Returns(new List<PostEvictionCallbackRegistration>());
        innerEntry.SetupGet(o => o.ExpirationTokens).Returns(new List<IChangeToken>());
        inner.Setup(o => o.CreateEntry(It.IsAny<object>())).Returns(innerEntry.Object);

        var entry = target.CreateEntry(testCallerKey);
        entry.Value = "testValue";
        entry.AbsoluteExpiration = new DateTime(2001, 2, 3);
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(666);
        entry.SlidingExpiration = TimeSpan.FromSeconds(777);
        entry.Priority = CacheItemPriority.High;
        entry.Size = 1024;
        entry.ExpirationTokens.Add(expirationToken);
        entry.PostEvictionCallbacks.Add(new PostEvictionCallbackRegistration { State = "testState", EvictionCallback = testEvicationCallback.Object });

        entry.Dispose(); // Act

        innerEntry.VerifySet(e => e.AbsoluteExpiration = new DateTime(2001, 2, 3));
        innerEntry.VerifySet(e => e.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(666));
        innerEntry.VerifySet(e => e.SlidingExpiration = TimeSpan.FromSeconds(777));
        innerEntry.VerifySet(e => e.Priority = CacheItemPriority.High);
        innerEntry.VerifySet(e => e.Size = 1024);
        innerEntry.Object.ExpirationTokens.Should().Equal(expirationToken);

        var callback = innerEntry.Object.PostEvictionCallbacks.Single();
        callback.State.Should().Be("testState");
        callback.EvictionCallback("ignoredKey", "callbackValue", EvictionReason.Expired, "callbackState");
        testEvicationCallback.Verify(c => c(testCallerKey, "callbackValue", EvictionReason.Expired, "callbackState"));

        innerEntry.Verify(e => e.Dispose(), Times.Once);
    }

    [Fact]
    public void Remove_ShouldCallInnerRemove()
    {
        target.Remove(testCallerKey); // Act

        inner.Verify(o => o.Remove(Tuple.Create(testIsolationPrefix, testCallerKey)));
        VerifyGetIsolationPrefix();
    }

    private void VerifyGetIsolationPrefix()
    {
        getIsolationPrefix.VerifyWithAnyArgs(g => g(null), Times.Once);
        getIsolationPrefix.Verify(g => g(testCallerKey));
    }
}
