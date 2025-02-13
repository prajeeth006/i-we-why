using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class DocumentIdConverterTests : ConverterTestsBase<DocumentId>
{
    public DocumentIdConverterTests()
        => Target = new DocumentIdConverter();

    [Theory]
    [InlineData("/path", "/id-factory/path")]
    [InlineData("/path/item", "/id-factory/path/item")]
    public void ShouldConvertValueToDocumentId(string inputValue, string expectedPath)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);
        var expectedId = expectedPath != null ? new DocumentId(expectedPath, culture: Context.Object.Culture) : null;

        ConvertAndExpect(expectedId); // Act
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnNull_IfEmpty(string inputValue)
        => ShouldConvertValueToDocumentId(inputValue, null);
}
