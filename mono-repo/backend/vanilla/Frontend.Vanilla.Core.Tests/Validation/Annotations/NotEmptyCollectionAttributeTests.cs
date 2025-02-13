using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public class NotEmptyCollectionAttributeTests
{
    [Fact]
    public void ErrorMessage_ShouldNotIncludeActualValue_BecauseItsAlwaysEmpty()
        => new NotEmptyCollectionAttribute().ErrorMessage.Should().Be("{MemberName} {InvalidReason}.");

    [Theory]
    [InlineData(true, new[] { "Hello" })]
    [InlineData(false, new string[0])]
    public void ShallFailValidationIfEmptyCollection(bool expectedValid, string[] value)
    {
        ValidationAttributeBase target = new NotEmptyCollectionAttribute();

        var result = target.GetInvalidReason(value); // Act

        result.Should().Be(expectedValid ? null : "collection can't be empty");
    }
}
