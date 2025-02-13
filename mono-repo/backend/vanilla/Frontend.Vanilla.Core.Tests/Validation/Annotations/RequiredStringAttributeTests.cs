using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public sealed class RequiredStringAttributeTests
{
    [Fact]
    public void Validate_ShouldPass()
        => RequiredStringAttribute.Validate("Hello", "TestProperty").Should().Be(ValidationResult.Success);

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void Validate_ShouldFail(string value)
    {
        var error = RequiredStringAttribute.Validate(value, "TestProperty"); // Act

        error.MemberNames.Should().Equal("TestProperty");
        error.ErrorMessage.Should().Be("TestProperty can't be null nor white-space.");
    }

    [Fact]
    public void Validate_ShouldSupportDisplayName()
    {
        var error = RequiredStringAttribute.Validate(null, "TestProperty", "My Test"); // Act

        error.MemberNames.Should().Equal("TestProperty");
        error.ErrorMessage.Should().Be("My Test can't be null nor white-space.");
    }
}
