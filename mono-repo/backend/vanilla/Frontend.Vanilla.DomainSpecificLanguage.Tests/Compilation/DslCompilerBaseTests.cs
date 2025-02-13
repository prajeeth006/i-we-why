using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public class DslCompilerBaseTests
{
    private IDslCompiler target;
    private Mock<DslCompilerBase> underlyingMock;

    public DslCompilerBaseTests()
    {
        underlyingMock = new Mock<DslCompilerBase>();
        target = underlyingMock.Object;
    }

    [Fact]
    public void CompileAction_ShouldWrapToDslAction()
    {
        var expr = Mock.Of<IDslExpression<VoidDslResult>>();
        var testWarnings = new[] { "Warn 1", "Warn 2" }.AsTrimmed();
        underlyingMock.Setup(m => m.Compile<VoidDslResult>("go()")).Returns(expr.WithWarnings(testWarnings));

        // Act
        var (action, warnings) = target.CompileAction("go()");

        action.Should().BeOfType<DslAction>()
            .Which.Expression.Should().BeSameAs(expr);
        warnings.Should().BeEquivalentTo(testWarnings);
    }
}
