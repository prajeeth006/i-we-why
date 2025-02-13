using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.FilterCondition;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.FilterCondition;

public class FilterConditionJustInTimeProcessorTestsWithTracing() : FilterConditionJustInTimeProcessorTests(true) { }

public class FilterConditionJustInTimeProcessorTestsWithoutTracing() : FilterConditionJustInTimeProcessorTests(false) { }

public abstract class FilterConditionJustInTimeProcessorTests : JustInTimeContentProcessorTestsBase
{
    protected FilterConditionJustInTimeProcessorTests(bool useTrace)
        : base(useTrace)
    {
        dslCondition = new Mock<IDslExpression<bool>>();
        Target = new FilterConditionJustInTimeProcessor(dslCondition.Object);

        dslCondition.SetupGet(c => c.OriginalString).Returns("Dsl.IsPassed");
        SetupContentFields(("Foo", "Bar"), ("Condition", null));
    }

    private readonly Mock<IDslExpression<bool>> dslCondition;

    [Fact]
    public async Task ShouldReturnSameContent_IfServerFilteringPassed()
    {
        dslCondition.Setup(c => c.EvaluateAsync(Mode)).ReturnsAsync(true);

        await RunAndExpectSameContentAsync(); // Act

        dslCondition.VerifyWithAnyArgs(c => c.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
        VerifyTrace(FilterConditionJustInTimeProcessor.TraceMessages.Passed);
    }

    [Fact]
    public async Task ShouldReturnSameContent_IfClientFilteringFullyPassed()
    {
        Options = TestContentLoadOptions.Get(DslEvaluation.PartialForClient);
        dslCondition.Setup(c => c.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(true));

        await RunAndExpectSameContentAsync(); // Act

        dslCondition.VerifyWithAnyArgs(c => c.EvaluateAsync(default(ExecutionMode)), Times.Never);
        VerifyTrace(FilterConditionJustInTimeProcessor.TraceMessages.Passed);
    }

    [Fact]
    public async Task ShouldReturnAdaptedContent_IfClientFilteringPassed()
    {
        Options = TestContentLoadOptions.Get(DslEvaluation.PartialForClient);
        dslCondition.Setup(c => c.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromClientExpression("client-dsl"));

        var result = await Target_ProcessAsync(); // Act

        result.VerifySuccess(expectedMetadata: InputContent.Metadata);
        result.Should().BeOfType<SuccessContent<IDocument>>()
            .Which.Document.Data.Fields.Should().Equal(new Dictionary<string, object>
            {
                ["Foo"] = "Bar",
                ["Condition"] = "client-dsl",
            });
        VerifyTrace("DSL condition evaluated to client-side expression: 'client-dsl'.");
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldFilterOut_IfFilteringNotPassed(DslEvaluation dslEvaluation)
    {
        Options = TestContentLoadOptions.Get(dslEvaluation);

        if (dslEvaluation == DslEvaluation.FullOnServer) dslCondition.Setup(c => c.EvaluateAsync(Mode)).ReturnsAsync(false);
        else dslCondition.Setup(c => c.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(false));

        var result = await Target_ProcessAsync(); // Act

        result.VerifyFiltered(expectedMetadata: InputContent.Metadata);
        VerifyTrace(FilterConditionJustInTimeProcessor.TraceMessages.Filtered);
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldReturnInvalidContent_IfExecutionThrows(DslEvaluation dslEvaluation)
    {
        Options = TestContentLoadOptions.Get(dslEvaluation);
        var ex = new Exception("Outer error", new Exception("Inner error"));

        if (dslEvaluation == DslEvaluation.FullOnServer) dslCondition.Setup(c => c.EvaluateAsync(Mode)).ThrowsAsync(ex);
        else dslCondition.Setup(c => c.EvaluateForClientAsync(Mode)).ThrowsAsync(ex);

        var result = await Target_ProcessAsync(); // Act

        result.Should().BeOfType<InvalidContent<IDocument>>()
            .Which.Errors.Should().Equal($"Failed {dslEvaluation} filter evaluation: {ex}");
        VerifyTrace($"Failed filter evaluation: {ex}");
    }

    [Fact]
    public void Ctor_ShouldThrow_IfNoCondition()
        => new Func<object>(() => new FilterConditionJustInTimeProcessor(null))
            .Should().Throw<ArgumentNullException>();

    private void VerifyTrace(string resultMsg)
        => Trace?.Should().BeEquivalentOrderedTo(
            $"Filtering {Options.DslEvaluation} by following DSL condition.",
            dslCondition.Object,
            resultMsg);
}
