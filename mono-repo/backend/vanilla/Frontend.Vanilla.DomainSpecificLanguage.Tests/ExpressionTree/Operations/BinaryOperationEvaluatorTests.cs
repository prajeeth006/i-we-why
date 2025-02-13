using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public abstract class BinaryOperationEvaluatorTestsBase
{
    internal IBinaryOperationEvaluator Target { get; set; }
    internal BinaryOperation Operation { get; set; }
    internal Mock<IExpressionTree> Left { get; set; }
    internal Mock<IExpressionTree> Right { get; set; }
    internal IExpressionTree LeftEvalResult { get; set; }
    internal IExpressionTree RightEvalResult { get; set; }
    internal EvaluationContext Ctx { get; set; }

    public BinaryOperationEvaluatorTestsBase()
    {
        Left = new Mock<IExpressionTree>();
        Right = new Mock<IExpressionTree>();
        Operation = new BinaryOperation(Mock.Of<IBinaryOperator>(), Left.Object, Right.Object);
        Ctx = TestEvaluationContext.Get();

        LeftEvalResult = Mock.Of<IExpressionTree>();
        RightEvalResult = Mock.Of<IExpressionTree>();
        Left.Setup(e => e.EvaluateAsync(Ctx)).Returns(() => Task.FromResult(LeftEvalResult));
        Right.Setup(e => e.EvaluateAsync(Ctx)).Returns(() => Task.FromResult(RightEvalResult));

        Setup();
    }

    protected abstract void Setup();

    internal Task<IExpressionTree> Act()
        => Target.EvaluateAsync(Operation, Ctx);

    protected async Task RunAndExpectRecreated()
    {
        var result = await Act();

        result.Should().Match<BinaryOperation>(o =>
            o.Operator == Operation.Operator
            && o.LeftOperand == LeftEvalResult
            && o.RightOperand == RightEvalResult);
    }
}

public class BinaryOperationEvaluatorTests : BinaryOperationEvaluatorTestsBase
{
    private Mock<BinaryEvaluationHandler> evaluateFunc;

    protected override void Setup()
    {
        evaluateFunc = new Mock<BinaryEvaluationHandler>();
        Target = new BinaryOperationEvaluator(evaluateFunc.Object);
    }

    [Fact]
    public async Task ShouldFullyEvaluate_IfBothOperandsAreLiterals()
    {
        var funcResult = StringLiteral.Get("omg");
        LeftEvalResult = StringLiteral.Get("lol");
        RightEvalResult = StringLiteral.Get("wtf");
        evaluateFunc.Setup(f => f((Literal)LeftEvalResult, (Literal)RightEvalResult)).Returns(funcResult);

        // Act
        var result = await Act();

        result.Should().BeSameAs(funcResult);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public async Task ShouldRecreate_IfNotBothOperandsAreLiterals(bool leftIsLiteral, bool rightIsLiteral)
    {
        LeftEvalResult = leftIsLiteral ? StringLiteral.Get("omg") : LeftEvalResult;
        RightEvalResult = rightIsLiteral ? StringLiteral.Get("lol") : RightEvalResult;

        // Act
        await RunAndExpectRecreated();
    }
}

public class LogicalCompositionEvaluatorTests : BinaryOperationEvaluatorTestsBase
{
    private Mock<Func<BooleanLiteral, LogicalCompositionResult>> evaluateFunc;

    protected override void Setup()
    {
        evaluateFunc = new Mock<Func<BooleanLiteral, LogicalCompositionResult>>();
        Target = new LogicalCompositionEvaluator(evaluateFunc.Object);
    }

    [Theory]
    [InlineData(true, LogicalCompositionResult.OtherOperand)]
    [InlineData(true, LogicalCompositionResult.ThisLiteral)]
    [InlineData(false, LogicalCompositionResult.OtherOperand)]
    [InlineData(false, LogicalCompositionResult.ThisLiteral)]
    internal async Task ShouldReturnLeft_AndNotEvaluateRight_IfLeftEvaluatesToItself(bool value, LogicalCompositionResult logicalResult)
    {
        LeftEvalResult = (BooleanLiteral)value;
        evaluateFunc.Setup(e => e((BooleanLiteral)LeftEvalResult)).Returns(logicalResult);

        var result = await Act();

        result.Should().BeSameAs(logicalResult == LogicalCompositionResult.ThisLiteral ? LeftEvalResult : RightEvalResult);
        Right.VerifyWithAnyArgs(r => r.EvaluateAsync(null), logicalResult == LogicalCompositionResult.ThisLiteral ? Times.Never() : Times.Once());
    }

    [Theory]
    [InlineData(true, LogicalCompositionResult.OtherOperand)]
    [InlineData(true, LogicalCompositionResult.ThisLiteral)]
    [InlineData(false, LogicalCompositionResult.OtherOperand)]
    [InlineData(false, LogicalCompositionResult.ThisLiteral)]
    internal async Task ShouldReturnRight_IfRightEvaluatesToItself(bool rightValue, LogicalCompositionResult logicalResult)
    {
        RightEvalResult = (BooleanLiteral)rightValue;
        evaluateFunc.Setup(e => e((BooleanLiteral)RightEvalResult)).Returns(logicalResult);

        var result = await Act();

        result.Should().BeSameAs(logicalResult == LogicalCompositionResult.ThisLiteral ? RightEvalResult : LeftEvalResult);
    }

    [Fact]
    public Task ShouldRecreate_IfNoOperandEvaluatedToLiteral()
        => RunAndExpectRecreated();
}

public class NotEmptyOperandEvaluatorTests : BinaryOperationEvaluatorTestsBase
{
    private Mock<Func<StringLiteral, bool>> isEmptyFunc;

    protected override void Setup()
    {
        isEmptyFunc = new Mock<Func<StringLiteral, bool>>();
        Target = new NotEmptyOperandEvaluator<StringLiteral>(isEmptyFunc.Object);
    }

    [Theory, BooleanData]
    public async Task ShouldEvaluateAccordingToLeftBeingEmpty(bool isLeftEmpty)
    {
        LeftEvalResult = StringLiteral.Get("bwin");
        isEmptyFunc.Setup(f => f((StringLiteral)LeftEvalResult)).Returns(isLeftEmpty);

        var result = await Act();

        result.Should().BeSameAs(isLeftEmpty ? RightEvalResult : LeftEvalResult);
        Right.VerifyWithAnyArgs(r => r.EvaluateAsync(null), !isLeftEmpty ? Times.Never() : Times.Once());
    }

    [Fact]
    public async Task ShouldEvaluateToLeft_IfRightIsEmpty()
    {
        RightEvalResult = StringLiteral.Get("bwin");
        isEmptyFunc.Setup(f => f((StringLiteral)RightEvalResult)).Returns(true);

        var result = await Act();

        result.Should().BeSameAs(LeftEvalResult);
    }

    [Fact]
    public async Task ShouldRecreate_IfLeftNotLiteral_AndRightNotEmpty()
    {
        RightEvalResult = StringLiteral.Get("bwin");
        await RunAndExpectRecreated();
    }

    [Fact]
    public Task ShouldRecreate_IfNoOperandEvaluatedToLiteral()
        => RunAndExpectRecreated();
}
