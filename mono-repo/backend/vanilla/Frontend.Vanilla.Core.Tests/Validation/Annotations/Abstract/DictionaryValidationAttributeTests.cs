using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations.Abstract;

public class DictionaryValidationAttributeTests
{
    private GenericValidationAttribute target;
    private Mock<DictionaryValidationAttribute> underlyingMock;

    public DictionaryValidationAttributeTests()
    {
        underlyingMock = new Mock<DictionaryValidationAttribute>();
        target = underlyingMock.Object;
    }

    [Theory]
    [InlineData(null)]
    [InlineData("invalid")]
    public void GetInvalidReason_ShouldDowncastDictionary(string invalidReason)
    {
        var dict = new Dictionary<string, int>();
        underlyingMock.Setup(t => t.GetInvalidReason(dict)).Returns(invalidReason);

        var result = target.GetInvalidReason(dict); // Act

        result.Should().Be(invalidReason);
    }

    [Fact]
    public void FormatActualValue_ShouldFormatDictionaryEntries()
    {
        var dict = new Dictionary<string, object>
        {
            { "Key 1", 123 },
            { "Key 2", new object() },
        };

        var result = target.FormatActualValue(dict); // Act
        var expected = $"{{{Environment.NewLine}    'Key 1': 123,{Environment.NewLine}    'Key 2': System.Object{Environment.NewLine}}}";
        result.Should().Be(expected);
    }
}
