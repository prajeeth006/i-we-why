using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.DslValidity;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.DslValidity;

public class DslValidityControllerTests
{
    private Mock<IDslSyntaxValidator> dslSyntaxValidatorMock;
    private DslValidityController target;

    public DslValidityControllerTests()
    {
        dslSyntaxValidatorMock = new Mock<IDslSyntaxValidator>();
        target = new DslValidityController(dslSyntaxValidatorMock.Object);
    }

    [Fact]
    public void Get_ShouldFailIfExpressionIsEmpty()
    {
        var result =
            target.Get(new ValidationRequest { Expression = string.Empty, ClrType = "System.Boolean" }) as
                BadRequestObjectResult;

        result.Should().NotBeNull();

        result?.Value.Should().BeEquivalentTo(new { message = "Parameter Expression is missing." });
    }

    [Fact]
    public void Get_ShouldFailIfClrTypeIsEmptyOrIncorrect()
    {
        var result =
            target.Get(new ValidationRequest { Expression = "TRUE", ClrType = "System.Weirdo" }) as
                BadRequestObjectResult;

        result.Should().NotBeNull();
        result?.Value.Should()
            .BeEquivalentTo(new { message = "Parameter ClrType is invalid. Supported values are: " + ExpressionTreeParser.SupportedResultTypes.Join() });
    }

    [Theory, InlineData("User.IsKnown", "System.Boolean")]
    public void Get_ShouldWorkIfExpressionAndClrTypeAreCorrect(string expression, string clrType)
    {
        dslSyntaxValidatorMock.Setup(o => o.Validate(expression, Type.GetType(clrType)!))
            .Returns(new DslSyntaxResult());

        // Act
        var result = target.Get(new ValidationRequest { Expression = expression, ClrType = clrType }) as OkObjectResult;

        var val = result?.Value as DslSyntaxResult;
        val?.ErrorMessage.Should().BeNull();
    }

    [Fact]
    public void Get_ShouldWorkIfExpressionIsWrongAndClrTypeIsCorrect()
    {
        dslSyntaxValidatorMock.Setup(o => o.Validate("Zmijuga", typeof(bool))).Returns(
            new DslSyntaxResult("Failed to parse Zmijuga",
                new List<TrimmedRequiredString> { "Failed to parse Zmijuga warning" }));

        // Act
        var result = target.Get(new ValidationRequest { Expression = "Zmijuga", ClrType = "System.Boolean" }) as OkObjectResult;

        var val = result?.Value as DslSyntaxResult;
        val?.ErrorMessage.Should().Be("Failed to parse Zmijuga");
        val?.Warnings[0].Should().Be("Failed to parse Zmijuga warning");
    }
}
