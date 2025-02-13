using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations.Abstract;

public class CollectionValidationAttributeTests
{
    private GenericValidationAttribute target;
    private Mock<CollectionValidationAttribute> underlyingMock;

    public CollectionValidationAttributeTests()
    {
        underlyingMock = new Mock<CollectionValidationAttribute>();
        target = underlyingMock.Object;
    }

    [Theory]
    [InlineData(null)]
    [InlineData("invalid")]
    public void GetInvalidReason_ShouldDowncastDictionary(string invalidReason)
    {
        var col = new List<string>();
        underlyingMock.Setup(t => t.GetInvalidReason(col)).Returns(invalidReason);

        var result = target.GetInvalidReason(col); // Act

        result.Should().Be(invalidReason);
    }

    [Fact]
    public void FormatActualValue_ShouldFormatDictionaryEntries()
    {
        var col = new[] { "a", 123, new object() };

        var result = target.FormatActualValue(col); // Act

        result.Should().Be("['a', 123, System.Object]");
    }
}
