using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting;

public class HistoryLogTests
{
    private IHistoryLog<TestItem> target;

    public HistoryLogTests()
        => target = new HistoryLog<TestItem>(maxCount: 4);

    public class TestItem : IHistoryItem
    {
        public UtcDateTime Time { get; set; }
    }

    [Fact]
    public void ShouldReturnEmptyInitialy()
        => target.GetItems().Should().BeEmpty();

    [Fact]
    public void ShouldAddItemsOrdered()
    {
        var item1 = GetItemForYear(2002);
        var item2 = GetItemForYear(2003);
        var item3 = GetItemForYear(2000);

        // Act
        target.AddRange(new[] { item1, item2, item3 });

        target.GetItems().Should().Equal(item2, item1, item3); // Should be ordered by Time
    }

    [Fact]
    public void ShouldSkipOldItems()
    {
        var existing1 = GetItemForYear(2001);
        var existing2 = GetItemForYear(2003);
        var existing3 = GetItemForYear(2000);
        target.AddRange(new[] { existing1, existing2, existing3 });

        var new1 = GetItemForYear(2002);
        var new2 = GetItemForYear(1999);
        var new3 = GetItemForYear(2004);

        // Act
        target.AddRange(new[] { new1, new2, new3 });

        target.GetItems().Should().Equal(new3, existing2, new1, existing1);
    }

    [Fact]
    public void ShouldSupportMaxCountZero()
    {
        target = new HistoryLog<TestItem>(maxCount: 0);
        target.GetItems().Should().BeEmpty();
        target.AddRange(new[] { GetItemForYear(2001) });
        target.GetItems().Should().BeEmpty();
    }

    private static TestItem GetItemForYear(int year)
        => new TestItem { Time = new UtcDateTime(year, 2, 3) };
}
