using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class DocumentIdCollectionConverterTests : ConverterTestsBase<IReadOnlyList<DocumentId>>
{
    public DocumentIdCollectionConverterTests()
        => Target = new DocumentIdCollectionConverter();

    [Theory]
    [InlineData("a", new[] { "a" })]
    [InlineData("a|b|c", new[] { "a", "b", "c" })]
    public void ShouldConvertFieldToTreeDocumentIds(string inputValue, string[] expectedDocumentPaths)
    {
        var expectedIds = expectedDocumentPaths.Select(p => new DocumentId("id-factory/" + p, culture: Context.Object.Culture)).ToArray();
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);

        ConvertAndExpect(expectedIds); // Act
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnEmpty_IfEmptyInput(string inputValue)
        => ShouldConvertFieldToTreeDocumentIds(inputValue, Array.Empty<string>());

    [Theory]
    [InlineData("a|b|c")]
    public void ShouldThrow_IfSelfReferencingItem(string inputValue)
    {
        Context.SetupGet(c => c.SourcePath).Returns("/id-factory/a");
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);

        Action actual = () => Target_Convert(); // Act
        actual.Should().Throw();
    }
}
