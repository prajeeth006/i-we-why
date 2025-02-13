using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests;

public class PlaceholderCompilerTests
{
    private IPlaceholderCompiler target;
    private Mock<IDslCompiler> dslCompiler;
    private IDslExpression<object> userNameExpr;
    private IDslExpression<object> userBalanceExpr;

    public PlaceholderCompilerTests()
    {
        dslCompiler = new Mock<IDslCompiler>();
        target = new PlaceholderCompiler(dslCompiler.Object);

        userNameExpr = Mock.Of<IDslExpression<object>>();
        userBalanceExpr = Mock.Of<IDslExpression<object>>();

        dslCompiler.Setup(c => c.Compile<object>("User.Name")).Returns(userNameExpr.WithWarnings("Warn 1"));
        dslCompiler.Setup(c => c.Compile<object>("User.Nick")).Returns(userNameExpr.WithWarnings("Warn 1"));
        dslCompiler.Setup(c => c.Compile<object>("User.Balance")).Returns(userBalanceExpr.WithWarnings("Warn 2.1", "Warn 2.2"));
    }

    [Fact]
    public void ShouldReturnEmpty_IfWhiteSpaceInput()
    {
        var (placeholders, warnings) = target.FindPlaceholders("no placeholder User.Name"); // Act

        placeholders.Should().BeEmpty();
        warnings.Should().BeEmpty();
        dslCompiler.VerifyWithAnyArgs(c => c.Compile<object>(null), Times.Never);
    }

    [Fact]
    public void ShouldFindAllPlaceholders()
    {
        // Act
        var (placeholders, warnings) = target.FindPlaceholders(
            "Hello _|User.Name|_, your balance is only _|User.Balance|_! Clear _|User.Nick|_?");

        placeholders.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, IDslExpression<object>>
        {
            { "_|User.Name|_", userNameExpr },
            { "_|User.Nick|_", userNameExpr },
            { "_|User.Balance|_", userBalanceExpr },
        });
        warnings.Should().BeEquivalentTo<TrimmedRequiredString>(new TrimmedRequiredString[]
        {
            "_|User.Name|_ - Warn 1",
            "_|User.Balance|_ - Warn 2.1",
            "_|User.Balance|_ - Warn 2.2",
            "_|User.Nick|_ - Warn 1",
        });
    }

    [Theory]
    [InlineData("Hello _|User.Name.",
        "Found unclosed placeholder at position 6 with text '_|User.Name.'.")]
    [InlineData("Hello _|User.Name, lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non mauris finibus, ullamcorper arcu id, auctor urna.",
        "Found unclosed placeholder at position 6 with text '_|User.Name, lorem ipsum dolor sit amet, consectet'.")]
    [InlineData("Hello _|  |_ empty.",
        "Found empty (hence invalid) placeholder at position 6 with text '_|  |_ empty.'.")]
    [InlineData("Hello _|  |_, lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non mauris finibus, ullamcorper arcu id, auctor urna.",
        "Found empty (hence invalid) placeholder at position 6 with text '_|  |_, lorem ipsum dolor sit amet, consectetur ad'.")]
    public void ShouldThrow_IfUnclosedOrEmptyPlaceholder(string inputStr, string expectedError)
    {
        Action act = () => target.FindPlaceholders(inputStr); // Act

        act.Should().Throw().WithMessage(expectedError);
    }
}
