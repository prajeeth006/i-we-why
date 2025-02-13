#nullable enable

using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class UtcDateTimeTests
{
    [Fact]
    public void Default_ShouldBeUtc()
    {
        var target = default(UtcDateTime); // Act
        Verify(target, 1, 1, 1, 0, 0, 0, 0);
    }

    [Fact]
    public void Constructor_ShouldCreateFromDateTime()
    {
        var target = new UtcDateTime(new DateTime(2001, 2, 3, 4, 5, 6, 7, DateTimeKind.Utc)); // Act
        Verify(target, 2001, 2, 3, 4, 5, 6, 7);
    }

    [Fact]
    public void Constructor_ShouldCreateFromDateTimeOffset()
    {
        var target = new UtcDateTime(new DateTimeOffset(2001, 2, 3, 4, 5, 6, 7, TimeSpan.FromHours(2))); // Act
        Verify(target, 2001, 2, 3, 2, 5, 6, 7);
    }

    [Fact]
    public void Constructor_ShouldCreateFromExplicitSegments()
    {
        var target = new UtcDateTime(2001, 2, 3, 4, 5, 6, 7); // Act
        Verify(target, 2001, 2, 3, 4, 5, 6, 7);
    }

    private static void Verify(UtcDateTime target, int year, int month, int day, int hour, int minute, int second, int millisecond)
    {
        target.Value.Should().Be(new DateTime(year, month, day, hour, minute, second, millisecond));
        target.Value.Kind.Should().Be(DateTimeKind.Utc);
    }

    private void RunAddTest(Func<UtcDateTime, UtcDateTime> act, int expectedDay = 1, int expectedHour = 1, int expectedMinute = 1, int expectedSecond = 1)
    {
        var target = new UtcDateTime(2001, 1, 1, 1, 1, 1, 1);

        var result = act(target);

        Verify(result, 2001, 1, expectedDay, expectedHour, expectedMinute, expectedSecond, 1);
        Verify(target, 2001, 1, 1, 1, 1, 1, 1); // Should be unchanged
    }

    [Fact]
    public void AddSeconds_ShouldCalculateCorrectly()
        => RunAddTest(t => t.AddSeconds(2), expectedSecond: 3);

    [Fact]
    public void AddMinutes_ShouldCalculateCorrectly()
        => RunAddTest(t => t.AddMinutes(3), expectedMinute: 4);

    [Fact]
    public void AddHours_ShouldCalculateCorrectly()
        => RunAddTest(t => t.AddHours(4), expectedHour: 5);

    [Fact]
    public void AddDays_ShouldCalculateCorrectly()
        => RunAddTest(t => t.AddDays(5), expectedDay: 6);

    [Fact]
    public void OperatorPlus_ShouldCalculateCorrectly()
        => RunAddTest(t => t + TimeSpan.FromHours(3), expectedHour: 4);

    [Fact]
    public void OperatorMinusTimeSpan_ShouldCalculateCorrectly()
        => RunAddTest(t => t - TimeSpan.FromMinutes(11), expectedHour: 0, expectedMinute: 50);

    [Fact]
    public void OperatorMinusUtcDateTime_ShouldCalculateCorrectly()
    {
        var result = new UtcDateTime(2001, 2, 3, 4, 5, 6) - new UtcDateTime(2001, 2, 1, 4, 5, 6); // Act
        result.Should().Be(TimeSpan.FromDays(2));
    }

    [Theory]
    [InlineData(2000, 2066, true)]
    [InlineData(2000, 2000, false)]
    [InlineData(2066, 2000, false)]
    public void OperatorLessThan_ShouldCalculateCorrectly(int year1, int year2, bool expected)
        => (new UtcDateTime(year1, 1, 1) < new UtcDateTime(year2, 1, 1)).Should().Be(expected);

    [Theory]
    [InlineData(2000, 2066, true)]
    [InlineData(2000, 2000, true)]
    [InlineData(2066, 2000, false)]
    public void OperatorLessThanOrEqual_ShouldCalculateCorrectly(int year1, int year2, bool expected)
        => (new UtcDateTime(year1, 1, 1) <= new UtcDateTime(year2, 1, 1)).Should().Be(expected);

    [Theory]
    [InlineData(2000, 2066, false)]
    [InlineData(2000, 2000, false)]
    [InlineData(2066, 2000, true)]
    public void OperatorGreaterThan_ShouldCalculateCorrectly(int year1, int year2, bool expected)
        => (new UtcDateTime(year1, 1, 1) > new UtcDateTime(year2, 1, 1)).Should().Be(expected);

    [Theory]
    [InlineData(2000, 2066, false)]
    [InlineData(2000, 2000, true)]
    [InlineData(2066, 2000, true)]
    public void OperatorGreaterThanOrEqual_ShouldCalculateCorrectly(int year1, int year2, bool expected)
        => (new UtcDateTime(year1, 1, 1) >= new UtcDateTime(year2, 1, 1)).Should().Be(expected);

    [Theory]
    [InlineData(ComparisonResult.Less, 2000, 2066)]
    [InlineData(ComparisonResult.Equal, 2000, 2000)]
    [InlineData(ComparisonResult.Greater, 2066, 2000)]
    internal void Equality_ShouldCalculateCorrectly(ComparisonResult expected, int year1, int year2)
    {
        var first = new UtcDateTime(year1, 1, 1);
        var second = new UtcDateTime(year2, 1, 1);

        EqualityTest.Run(expected, first, second); // Tests IEquatable and IComparable

        // Test operators
        (first == second).Should().Be(expected == ComparisonResult.Equal);
        (second == first).Should().Be(expected == ComparisonResult.Equal);
        (first != second).Should().Be(expected != ComparisonResult.Equal);
        (second != first).Should().Be(expected != ComparisonResult.Equal);
    }

    [Fact]
    public void ShouldReadAsDateTime_WhenJsonDeserialization()
    {
        var target = JsonConvert.DeserializeObject<UtcDateTime>("'2001-02-03T04:05:06.070Z'");
        Verify(target, 2001, 2, 3, 4, 5, 6, 70);
    }

    [Fact]
    public void ShouldReadAsNull_WhenNullJsonDeserialization()
    {
        var target = JsonConvert.DeserializeObject<UtcDateTime?>("null");
        target.Should().BeNull();
    }

    [Fact]
    public void ShouldWriteAsDateTime_WhenJsonSerialization()
    {
        var json = JsonConvert.SerializeObject(new UtcDateTime(2001, 2, 3, 4, 5, 6));
        json.Should().Be("\"2001-02-03T04:05:06Z\"");
    }

    [Fact]
    public void ToString_ShouldReturnIsoFormatted()
    {
        var target = new UtcDateTime(2001, 2, 3, 4, 5, 6);
        target.ToString().Should().Be("2001-02-03T04:05:06.0000000Z"); // Act
    }

    [Fact]
    public void Parse_ShouldParseIsoFormat()
    {
        var target = UtcDateTime.Parse("2001-02-03T04:05:06.0000000Z"); // Act
        Verify(target, 2001, 2, 3, 4, 5, 6, 0);
    }

    [Fact]
    public void ConvertTo_ShouldConvertCorrectly()
    {
        var dateTime = new UtcDateTime(2001, 2, 3, 14, 15, 16);
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Ekaterinburg Standard Time");

        // Act
        var localTime = dateTime.ConvertTo(timeZone);

        localTime.Should().Be(new DateTimeOffset(2001, 2, 3, 19, 15, 16, TimeSpan.FromHours(5)));
    }
}
