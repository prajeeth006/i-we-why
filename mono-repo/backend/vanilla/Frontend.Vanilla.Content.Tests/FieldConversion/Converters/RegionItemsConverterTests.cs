using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class RegionItemsConverterTests : CollectionConverterTestsBase<KeyValuePair<string, DocumentId>>
{
    public RegionItemsConverterTests()
    {
        Target = new RegionItemsConverter(BwinCollectionParser.Object);
        Context.SetupGet(c => c.FieldValue).Returns("field val");
    }

    [Fact]
    public void ShouldConvertItemsToRegionItems()
    {
        BwinCollectionParser.Setup(p => p.Parse("field val")).Returns(new[]
        {
            ("k1", "v1"),
            ("k2", "v2"),
        });

        ConvertAndExpectItems( // Act
            KeyValue.Get("k1", new DocumentId("id-factory/v1", culture: Context.Object.Culture)),
            KeyValue.Get("k2", new DocumentId("id-factory/v2", culture: Context.Object.Culture)));
    }

    [Fact]
    public void ShouldConvertToEmpty_IfEmptyInput()
    {
        BwinCollectionParser.Setup(p => p.Parse("field val")).Returns(Array.Empty<(string, string)>());

        ConvertAndExpectItems(); // Act
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldThrow_IfEmptyItemValue(string value)
    {
        BwinCollectionParser.Setup(p => p.Parse("field val")).Returns(new[]
        {
            ("k1", "v1"),
            ("k2", value),
        });

        Target_Convert.Should().Throw() // Act
            .WithMessage("Entry with key 'k2' is missing target document ID.");
    }
}
