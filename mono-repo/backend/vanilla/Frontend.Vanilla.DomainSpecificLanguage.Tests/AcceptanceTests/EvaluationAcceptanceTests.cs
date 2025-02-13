using FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.AcceptanceTests;

public sealed class EvaluationAcceptanceTests : AcceptanceTestsBase
{
    public EvaluationAcceptanceTests()
    {
        UserDslProvider.Setup(p => p.GetLoginName()).Returns("Chuck Norris"); // Client evaluated
        UserDslProvider.Setup(p => p.GetVisitCount()).Returns(123); // Server evaluated
        AppDslProvider.Setup(p => p.IsProduction).Returns(true);
    }

    [Fact]
    public void ShouldEvaluateFullyOnServer_IfString()
    {
        var (expr, _) = Compiler.Compile<string>("User.LoginName");
        expr.Evaluate().Should().Be("Chuck Norris"); // Act
    }

    [Fact]
    public void ShouldEvaluateFullyOnServer_IfNumber()
    {
        var (expr, _) = Compiler.Compile<decimal>("User.VisitCount");
        expr.Evaluate().Should().Be(123m); // Act
    }

    [Fact]
    public void ShouldEvaluateFullyOnServer_IfFinalValueForClientEvaluation()
    {
        var (expr, _) = Compiler.Compile<bool>("App.IsProduction");

        var result = expr.EvaluateForClient(); // Act

        result.Value.Should().BeTrue();
    }

    [Fact]
    public void ShouldEvaluateToClientExpression_IfNotFinalValueForClientEvaluation()
    {
        var (expr, _) = Compiler.Compile<string>("User.LoginName");

        var result = expr.EvaluateForClient(); // Act

        result.ClientExpression.Should().Be("c.User.LoginName");
    }

    [Fact]
    public void ShouldEvaluateLogicalExpressionInOptimizedWay()
    {
        var (expr, _) = Compiler.Compile<bool>("User.VisitCount > 100 OR User.LoginName = 'Bruce Lee'");

        var value = expr.Evaluate(); // Act

        value.Should().BeTrue();
        UserDslProvider.Verify(p => p.GetLoginName(), Times.Never); // No need to evaluated right part
    }

    [Fact]
    public void ShouldSupportUpcasting()
    {
        var (expr, _) = Compiler.Compile<object>("User.LoginName");
        expr.Evaluate().Should().Be("Chuck Norris"); // Act
    }

    [Fact]
    public void ShouldHonorLeftValueInLogicalOr()
    {
        AppDslProvider.Setup(u => u.Environment).Returns("prod");
        var (expr, _) = Compiler.Compile<string>("User.LoginName OR App.Environment");

        var result = expr.EvaluateForClient(); // Act

        result.ClientExpression.Should().Be("(c.User.LoginName||'prod')");
    }

    [Fact]
    public void ShouldExecuteAction_OnServer()
    {
        var (action, _) = Compiler.CompileAction(@"IF User.VisitCount > 100 THEN
                Cookies.SetSession('username', User.LoginName)
                Cookies.SetSession('username', 'Bruce Lee')
                Cookies.SetSession('visits', STRING User.VisitCount)
            END");

        // Act
        action.Execute();

        CookiesDslProvider.Verify(p => p.SetSession("username", "Chuck Norris"));
        CookiesDslProvider.Verify(p => p.SetSession("username", "Chuck Norris"));
        CookiesDslProvider.Verify(p => p.SetSession("visits", "123"));
    }

    [Fact]
    public void ShouldExecuteAction_OnServer2()
    {
        UserDslProvider.Setup(p => p.GetVisitCount()).Returns(1);

        var (action, _) = Compiler.CompileAction(@"x := User.VisitCount
IF x  = 1 THEN
y:= User.LoginName
Cookies.SetSession('test', y)
END");

        // Act
        var scr = action.ExecuteToClientScript();
    }
}
