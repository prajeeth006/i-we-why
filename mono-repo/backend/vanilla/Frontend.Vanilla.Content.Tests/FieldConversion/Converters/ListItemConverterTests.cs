using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class ListItemConverterTests : CollectionConverterTestsBase<ListItem>
{
    public ListItemConverterTests()
    {
        Target = new ListItemConverter(BwinCollectionParser.Object);
    }

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { Array.Empty<(string, string)>(), Array.Empty<ListItem>() },
        new object[]
        {
            new[]
            {
                ("k1", "v1"),
                ("k2", "v2"),
            },
            new[]
            {
                new ListItem("k1", "v1"),
                new ListItem("k2", "v2"),
            },
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    public void ShouldConvertItemsToListItems(IReadOnlyList<(string Key, string Value)> parsedRawItems, ListItem[] expectedResult)
    {
        Context.SetupGet(c => c.FieldValue).Returns("test");
        BwinCollectionParser.Setup(p => p.Parse("test")).Returns(parsedRawItems);

        ConvertAndExpectItems(expectedResult); // Act
    }
}
