using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Tracing;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching.Tracing;

public class TracedMemoryCacheTests
{
    private IMemoryCache target;
    private Mock<IMemoryCache> inner;
    private TestRecordingTrace trace;

    public TracedMemoryCacheTests()
    {
        inner = new Mock<IMemoryCache>();
        var traceRecorder = new Mock<ITraceRecorder>();
        target = new TracedMemoryCache(inner.Object, traceRecorder.Object);

        traceRecorder.Setup(r => r.GetRecordingTrace()).Returns(() => trace);
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(true, true)]
    public void TryGetValue_ShouldRecordTrace_IfEnabled(bool isTraceRecorded, bool isCacheHit)
    {
        object testValue = "vv";
        inner.Setup(i => i.TryGetValue("kk", out testValue)).Returns(isCacheHit);
        trace = isTraceRecorded ? new TestRecordingTrace() : null;

        // Act
        var result = target.TryGetValue("kk", out var value);

        result.Should().Be(isCacheHit);
        value.Should().Be(testValue);

        if (isTraceRecorded)
            trace.Recorded.Single().Verify(
                @"MemoryCache read: ""kk""",
                ("cacheEntry.key", @"""kk"""),
                ("cacheEntry.keyType", "System.String"),
                ("cacheEntry.value", @"""vv"""),
                ("isCacheHit", isCacheHit));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void CreateEntry_ShouldRecordTrace_IfEnabled(bool isTraceRecorded)
    {
        var testEntry = new Mock<ICacheEntry>();
        inner.Setup(i => i.CreateEntry("kk1")).Returns(testEntry.Object);
        trace = isTraceRecorded ? new TestRecordingTrace() : null;

        var entry = target.CreateEntry("kk1"); // Act 1

        if (!isTraceRecorded)
        {
            entry.Should().BeSameAs(testEntry.Object);

            return;
        }

        trace.Recorded.Should().BeEmpty(); // B/c entry not written yet
        entry.Should().BeAssignableTo<MemoryCacheEntryDecorator>()
            .Which.Inner.Should().BeSameAs(testEntry.Object);
        testEntry.Verify(e => e.Dispose(), Times.Never);

        testEntry.SetupGet(e => e.Key).Returns("kk2");
        testEntry.SetupGet(e => e.Value).Returns("vv");
        testEntry.SetupGet(e => e.AbsoluteExpiration).Returns(new DateTimeOffset(2000, 1, 2, 3, 4, 5, TimeSpan.Zero));
        testEntry.SetupGet(e => e.AbsoluteExpirationRelativeToNow).Returns(new TimeSpan(111));
        testEntry.SetupGet(e => e.SlidingExpiration).Returns(new TimeSpan(222));

        entry.Dispose(); // Act 2 - actual write

        testEntry.Verify(e => e.Dispose());
        trace.Recorded.Single().Verify(
            @"MemoryCache write: ""kk2""",
            ("cacheEntry.key", @"""kk2"""),
            ("cacheEntry.keyType", "System.String"),
            ("cacheEntry.value", @"""vv"""),
            ("cacheEntry.absoluteExpiration", new DateTime(2000, 1, 2, 3, 4, 5, DateTimeKind.Utc)),
            ("cacheEntry.absoluteExpirationRelativeToNow", new TimeSpan(111)),
            ("cacheEntry.slidingExpiration", new TimeSpan(222)));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Remove_ShouldRecordTrace_IfEnabled(bool isTraceRecorded)
    {
        trace = isTraceRecorded ? new TestRecordingTrace() : null;

        target.Remove("kk"); // Act

        inner.Verify(i => i.Remove("kk"));
        trace?.Recorded.Single().Verify(
            @"MemoryCache removal: ""kk""",
            ("cacheEntry.key", @"""kk"""),
            ("cacheEntry.keyType", "System.String"));
    }

    public static readonly IEnumerable<object[]> ObjectSerializationTestCases = new[]
    {
        new object[] { null, new[] { "null" } },
        new object[] { 111, new[] { "111" } },
        new object[] { "kk", new[] { @"""kk""" } },
        new object[] { new { Value = 111 }, new[] { @"{""Value"":111}" } },
        new object[] { new Foo(), new[] { $"Failed to serialize {typeof(Foo)}:", nameof(Foo.TestProp), "System.Exception: Oups" } },
    };

    [Theory]
    [MemberData(nameof(ObjectSerializationTestCases))]
    public void ShouldSerializeObjectsSafely(object key, string[] expectedTrace)
    {
        trace = new TestRecordingTrace();

        target.Remove(key); // Act

        var value = trace.Recorded.Single().Values.Single(v => v.Key == "cacheEntry.key");
        ((string)value.Value).Should().ContainAll(expectedTrace);
    }

    public class Foo
    {
        public string TestProp => throw new Exception("Oups");
    }
}
