using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public sealed class ProviderAccessTests
{
    private readonly Mock<ProviderMemberAccessor> accessor;
    private readonly Mock<IExpressionTree> param1;
    private readonly Mock<IExpressionTree> param2;
    private readonly Mock<IExpressionTree> param3;
    private readonly ExecutionMode mode;
    private readonly Exception testEx;
    private readonly TestRecordingTrace trace;
    private ProviderMember member;
    private IExpressionTree[] parametersForTarget;

    public ProviderAccessTests()
    {
        parametersForTarget = Array.Empty<IExpressionTree>();
        accessor = new Mock<ProviderMemberAccessor>();
        param1 = new Mock<IExpressionTree>();
        param2 = new Mock<IExpressionTree>();
        param3 = new Mock<IExpressionTree>();
        mode = TestExecutionMode.Get();
        testEx = new Exception("Oups");
        trace = new TestRecordingTrace();

        param1.SetupGet(p => p.ResultType).Returns(DslType.Number);
        param2.SetupGet(p => p.ResultType).Returns(DslType.String);
        param3.SetupGet(p => p.ResultType).Returns(DslType.Boolean);
        SetupMember();
    }

    private ProviderAccess GetTarget()
        => new ProviderAccess(member, parametersForTarget);

    private EvaluationContext GetEvalContext(DslEvaluation evaluation = DslEvaluation.FullOnServer)
        => new EvaluationContext(mode, evaluation, trace);

    [Theory]
    [InlineData(DslType.Boolean, false)]
    [InlineData(DslType.Boolean, true)]
    [InlineData(DslType.Number, false)]
    [InlineData(DslType.Number, true)]
    [InlineData(DslType.String, false)]
    [InlineData(DslType.String, true)]
    [InlineData(DslType.Void, false)]
    [InlineData(DslType.Void, true)]
    internal void Constructor_ShouldCreate(DslType resultType, bool isMethod)
    {
        SetupMember(
            resultType: resultType,
            parameters: isMethod ? new[] { param1.Object, param2.Object } : Array.Empty<IExpressionTree>());

        // Act
        var target = GetTarget();

        target.Member.Should().BeSameAs(member);
        target.ResultType.Should().Be(resultType);
        target.Parameters.Should().Equal(parametersForTarget);
    }

    [Fact]
    public void Constructor_ShouldThrow_IfPropertyCalledWithParameters()
    {
        SetupMember(); // Takes no parameters
        parametersForTarget = new[] { param1.Object, param2.Object };

        Func<object> act = GetTarget;

        act.Should().Throw<DslArgumentException>()
            .WithMessage("DSL provider member 'Foo.Bar' can't be called with any parameter because it's a property but there are 2 parameters specified.");
    }

    [Theory]
    [InlineData(new[] { DslType.String }, "String")] // Different types
    [InlineData(new DslType[0], "")] // Less (no) parameters
    [InlineData(new[] { DslType.Number, DslType.String }, "Number, String")] // More parameters
    internal void Constructor_ShouldThrow_IfMethodCalledWithDifferentParameters(DslType[] actualParamTypes, string reportedArgs)
    {
        SetupMember(parameters: param1.Object); // Takes parameters above
        parametersForTarget = actualParamTypes.Select(t => Mock.Of<IExpressionTree>(e => e.ResultType == t)).ToArray();

        Func<object> act = GetTarget;

        act.Should().Throw<DslArgumentException>()
            .WithMessage($"DSL provider function 'Foo.Bar' must be called with parameters (arg0: Number) but these are specified: ({reportedArgs}).");
    }

    [Fact]
    public void GetChildren_ShouldReturnParameters()
    {
        SetupMember(parameters: new[] { param1.Object, param2.Object });

        // Act
        GetTarget().GetChildren().Should().BeEquivalentTo(param1.Object, param2.Object);
    }

    public static IEnumerable<object[]> FullEvaluationInlineDatas => new[]
    {
        new object[] { DslEvaluation.Optimization, ValueVolatility.Static },
        new object[] { DslEvaluation.FullOnServer, ValueVolatility.Static },
        new object[] { DslEvaluation.FullOnServer, ValueVolatility.Server },
        new object[] { DslEvaluation.FullOnServer, ValueVolatility.Client },
        new object[] { DslEvaluation.PartialForClient, ValueVolatility.Static },
        new object[] { DslEvaluation.PartialForClient, ValueVolatility.Server },
    };

    public static readonly IEnumerable<object[]> ClientEvaluationInlineDatas =
        from evaluation in Enum<DslEvaluation>.Values
        from volatility in Enum<ValueVolatility>.Values
        from isClientSideOnly in new[] { true, false }
        where !FullEvaluationInlineDatas.Any(c => c.SequenceEqual(new object[] { evaluation, volatility }))
        where !isClientSideOnly || volatility == ValueVolatility.Client
        select new object[] { evaluation, volatility, isClientSideOnly };

    [Theory, MemberData(nameof(FullEvaluationInlineDatas))]
    internal async Task EvaluateAsync_ShouldFullyEvaluateProperty_IfWontChangeOnClient(DslEvaluation evaluation, ValueVolatility volatility)
    {
        var ctx = GetEvalContext(evaluation);
        accessor.Setup(a => a(mode, new object[0])).ReturnsAsync("bwin");
        SetupMember(volatility);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<StringLiteral>(l => l.Value == "bwin");
        trace.Recorded.Should().BeEmpty();
    }

    [Theory, MemberData(nameof(FullEvaluationInlineDatas))]
    internal async Task EvaluateAsync_ShouldFullyEvaluateMethod_IfWontChangeOnClient_AndParametersEvaluated(DslEvaluation evaluation, ValueVolatility volatility)
    {
        var ctx = GetEvalContext(evaluation);
        param1.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(NumberLiteral.Get(6.66m));
        param2.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(StringLiteral.Get("Foo"));
        accessor.Setup(a => a(mode, new object[] { 6.66m, "Foo" })).ReturnsAsync("bwin");
        SetupMember(volatility, parameters: new[] { param1.Object, param2.Object });

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<StringLiteral>(l => l.Value == "bwin");
        trace.Recorded.Should().BeEmpty();
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecordTracer_IfFullyEvaluatedAction()
    {
        var ctx = GetEvalContext();
        param1.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(NumberLiteral.Get(6.66m));
        param2.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(StringLiteral.Get("blah"));
        accessor.Setup(a => a(mode, new object[] { 6.66m, "blah" })).ReturnsAsync(VoidDslResult.Singleton);
        SetupMember(resultType: DslType.Void, parameters: new[] { param1.Object, param2.Object });

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(VoidLiteral.Singleton);
        trace.Recorded.Single().Verify("DSL action executed: {providerName}.{memberName}({parameters})",
            ("providerName", "Foo"),
            ("memberName", "Bar"),
            ("parameters", new object[] { 6.66m, "blah" }),
            ("executionMode", mode.ToString()));
    }

    [Theory, MemberData(nameof(ClientEvaluationInlineDatas))]
    internal async Task EvaluateAsync_ShouldRecreateProperty_IfCanChangeOnClient(DslEvaluation evaluation, ValueVolatility volatility, bool isClientSideOnly)
    {
        var ctx = GetEvalContext(evaluation);
        SetupMember(volatility, isClientSideOnly);
        var target = GetTarget();

        // Act
        var result = await target.EvaluateAsync(ctx);

        result.Should().BeSameAs(target);
        accessor.VerifyWithAnyArgs(a => a(default, null), Times.Never);
        trace.Recorded.Should().BeEmpty();
    }

    [Theory, MemberData(nameof(ClientEvaluationInlineDatas))]
    internal async Task EvaluateAsync_ShouldRecreateMethod_IfCanChangeOnClient(DslEvaluation evaluation, ValueVolatility volatility, bool isClientSideOnly)
    {
        var ctx = GetEvalContext(evaluation);
        var param1Evaluated = Mock.Of<IExpressionTree>(p => p.ResultType == DslType.Number);
        param1.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(param1Evaluated);
        SetupMember(volatility, isClientSideOnly, parameters: param1.Object);

        // Act
        await RunAndExpectRecreated(ctx, param1Evaluated);
    }

    [Theory]
    [InlineData(DslEvaluation.Optimization, ValueVolatility.Client)]
    [InlineData(DslEvaluation.Optimization, ValueVolatility.Server)]
    [InlineData(DslEvaluation.FullOnServer, ValueVolatility.Client)]
    [InlineData(DslEvaluation.FullOnServer, ValueVolatility.Server)]
    [InlineData(DslEvaluation.PartialForClient, ValueVolatility.Client)]
    [InlineData(DslEvaluation.PartialForClient, ValueVolatility.Server)]
    internal async Task EvaluateAsync_ShouldRecreateMethod_IfSomeParameterNotLiteral(DslEvaluation evaluation, ValueVolatility volatility)
    {
        var ctx = GetEvalContext(evaluation);
        var param1Literal = NumberLiteral.Get(123m);
        var param2NotLiteral = Mock.Of<IExpressionTree>();
        param1.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(param1Literal);
        param2.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(param2NotLiteral);
        SetupMember(volatility, parameters: new[] { param1.Object, param2.Object });

        // Act
        await RunAndExpectRecreated(ctx, param1Literal, param2NotLiteral);
    }

    private async Task RunAndExpectRecreated(EvaluationContext ctx, params IExpressionTree[] parameters)
    {
        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<ProviderAccess>(a => a.Member == member && a.Parameters.SequenceEqual(parameters));
        accessor.VerifyWithAnyArgs(a => a(default, null), Times.Never);
        trace.Recorded.Should().BeEmpty();
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnEmptyString_IfNullStringResult()
    {
        var ctx = GetEvalContext();
        accessor.Setup(a => a(mode, Array.Empty<string>())).ReturnsAsync((object)null);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(StringLiteral.Empty);
        trace.Recorded.Should().BeEmpty();
    }

    [Fact]
    public void EvaluateAsync_ShouldThrow_IfTryingToEvaluateClientSideOnlyProviderOnServer()
    {
        var ctx = GetEvalContext();
        SetupMember(volatility: ValueVolatility.Client, isClientSideOnly: true);
        var target = GetTarget();

        Func<Task> act = () => target.EvaluateAsync(ctx);

        act.Should().ThrowAsync<Exception>().WithMessage("Failed runtime evaluation of DSL provider member Foo.Bar.")
            .Where(e => e.InnerException.Message.Contains("Attempt to get value of ClientSideOnly provider member on the server"));
    }

    [Fact]
    public async Task EvaluateAsync_ShouldThrow_IfNullForOtherType()
    {
        var ctx = GetEvalContext();
        SetupMember(resultType: DslType.Number);
        accessor.SetupWithAnyArgs(a => a(default, null)).ReturnsAsync((object)null);
        var target = GetTarget();

        Func<Task> act = () => target.EvaluateAsync(ctx);

        (await act.Should().ThrowAsync<Exception>()).WithMessage("Failed runtime evaluation of DSL provider member Foo.Bar.")
            .Which.InnerException?.Message.Should().Be("Provider returned unexpected null for type Number.");
    }

    [Fact]
    public void EvaluateAsync_ShouldThrow_IfPropertyEvaluationFails()
    {
        var ctx = GetEvalContext();
        accessor.SetupWithAnyArgs(a => a(default, null)).ThrowsAsync(testEx);
        SetupMember();

        RunEvalFailedTest(ctx, "Failed runtime evaluation of DSL provider member Foo.Bar.");
    }

    [Fact]
    public void EvaluateAsync_ShouldThrow_IfMethodParameterFail()
    {
        var ctx = GetEvalContext();
        param1.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(NumberLiteral.Get(6.66m));
        param2.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(StringLiteral.Get("Foo"));
        param3.Setup(p => p.EvaluateAsync(ctx)).ThrowsAsync(testEx);
        SetupMember(parameters: new[] { param1.Object, param2.Object, param3.Object });

        RunEvalFailedTest(ctx,
            "Failed runtime evaluation of DSL provider member Foo.Bar(arg0: Number, arg1: String, arg2: Boolean) with arguments: (not evaluated yet).");
    }

    [Fact]
    public void EvaluateAsync_ShouldThrow_IfMethodEvaluationFails()
    {
        var ctx = GetEvalContext();
        accessor.SetupWithAnyArgs(a => a(default, null)).Throws(testEx);
        param1.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(NumberLiteral.Get(6.66m));
        param2.Setup(p => p.EvaluateAsync(ctx)).ReturnsAsync(StringLiteral.Get("Foo"));
        SetupMember(parameters: new[] { param1.Object, param2.Object });

        RunEvalFailedTest(ctx, "Failed runtime evaluation of DSL provider member Foo.Bar(arg0: Number, arg1: String) with arguments: 6.66, 'Foo'.");
    }

    private void RunEvalFailedTest(EvaluationContext ctx, string expectedMsg)
    {
        var target = GetTarget();

        Func<Task> act = () => target.EvaluateAsync(ctx);

        act.Should().ThrowAsync<Exception>().Result.WithMessage(expectedMsg).Which
            .InnerException.Should().BeSameAs(testEx);
    }

    [Theory]
    [InlineData(DslType.String, 0, "c.Foo.Bar")]
    [InlineData(DslType.String, 1, "c.Foo.Bar(xxx)")]
    [InlineData(DslType.String, 3, "c.Foo.Bar(xxx,yyy,zzz)")]
    [InlineData(DslType.Void, 0, "c.Foo.Bar();")]
    [InlineData(DslType.Void, 1, "c.Foo.Bar(xxx);")]
    [InlineData(DslType.Void, 3, "c.Foo.Bar(xxx,yyy,zzz);")]
    internal void SerializeToClient_ShouldReturnClientExression(DslType resultType, int paramCount, string expected)
    {
        SetupMember(
            resultType: resultType,
            parameters: new[]
            {
                Mock.Of<IExpressionTree>(p => p.SerializeToClient() == "xxx"),
                Mock.Of<IExpressionTree>(p => p.SerializeToClient() == "yyy"),
                Mock.Of<IExpressionTree>(p => p.SerializeToClient() == "zzz"),
            }.Take(paramCount).ToArray());

        // Act
        var result = GetTarget().SerializeToClient();

        result.Should().Be(expected);
    }

    public static IEnumerable<object[]> GetEqualityInlineDatas()
    {
        var (param1, equalParam1) = TestExpressionTree.GetEqual();
        var (param2, equalParam2) = TestExpressionTree.GetEqual();
        var differentParams = new[] { Mock.Of<IExpressionTree>(), Mock.Of<IExpressionTree>() };
        var withParams = new ProviderAccess(GetMember(param1, param2), new[] { param1, param2 });
        var noParams = new ProviderAccess(GetMember(), Array.Empty<IExpressionTree>());

        return new[]
        {
            new object[] { true, withParams, new ProviderAccess(withParams.Member, new[] { equalParam1, equalParam2 }) },
            new object[] { false, withParams, new ProviderAccess(withParams.Member, new[] { equalParam2, equalParam1 }) }, // Different order of parameters
            new object[] { false, withParams, new ProviderAccess(GetMember(param1, param2), new[] { equalParam1, equalParam2 }) }, // Different member
            new object[] { false, withParams, new ProviderAccess(withParams.Member, new[] { equalParam1, Mock.Of<IExpressionTree>() }) }, // Different one parameter
            new object[] { false, withParams, new ProviderAccess(GetMember(differentParams), differentParams) }, // Completely different, same number or params
            new object[] { false, withParams, new ProviderAccess(GetMember(param1), new[] { equalParam1 }) }, // Different number of params
            new object[] { true, noParams, new ProviderAccess(noParams.Member, Array.Empty<IExpressionTree>()) },
            new object[] { false, noParams, new ProviderAccess(GetMember(), Array.Empty<IExpressionTree>()) }, // Different member
            new object[] { false, noParams, withParams },
        };
    }

    private static ProviderMember GetMember(params IExpressionTree[] parameters)
    {
        var memberParams = parameters.Select((p, i) => new ProviderMemberParameter(p.ResultType, new Identifier($"arg{i}")));

        return new ProviderMember(
            new Identifier("Foo"),
            new Identifier("Bar"),
            default,
            memberParams,
            "docs",
            default,
            null,
            false,
            Mock.Of<ProviderMemberAccessor>(),
            false);
    }

    [Theory, MemberData(nameof(GetEqualityInlineDatas))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, ProviderAccess arg1, ProviderAccess arg2)
        => EqualityTest.Run(expected, arg1, arg2);

    [Fact]
    public void ToString_ShouldRecreateOriginalExpression_IfProperty()
        => GetTarget().ToString().Should().Be("Foo.Bar");

    [Fact]
    public void ToString_ShouldRecreateOriginalExpression_IfFunction()
    {
        param1.Setup(p => p.ToString()).Returns("pp1");
        param2.Setup(p => p.ToString()).Returns("pp2");
        SetupMember(parameters: new[] { param1.Object, param2.Object });

        // Act & assert
        GetTarget().ToString().Should().Be("Foo.Bar(pp1, pp2)");
    }

    private void SetupMember(
        ValueVolatility volatility = ValueVolatility.Server,
        bool isClientSideOnly = false,
        DslType resultType = DslType.String,
        bool skipInitialValueGetOnDslPage = false,
        params IExpressionTree[] parameters)
    {
        parametersForTarget = parameters;
        var memberParams = parameters.Select((p, i) => new ProviderMemberParameter(p.ResultType, new Identifier("arg" + i)));
        member = new ProviderMember(
            new Identifier("Foo"),
            new Identifier("Bar"),
            resultType,
            memberParams,
            "documentation",
            volatility,
            "obsolete",
            isClientSideOnly,
            accessor.Object,
            skipInitialValueGetOnDslPage);
    }
}
