using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.InlinedFilters;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.InlinedFilters;

public class InlinedFiltersJustInTimeProcessorTestsWithTracing() : InlinedFiltersJustInTimeProcessorTests(true) { }

public class InlinedFiltersJustInTimeProcessorTestsWithoutTracing() : InlinedFiltersJustInTimeProcessorTests(false) { }

public abstract class InlinedFiltersJustInTimeProcessorTests : JustInTimeContentProcessorTestsBase, IDisposable
{
    protected InlinedFiltersJustInTimeProcessorTests(bool useTrace)
        : base(useTrace)
    {
        SetupExpression(out expr1);
        SetupExpression(out expr2);
        SetupExpression(out expr3);

        var namesOfFieldsWithFilters = new TrimmedRequiredString[] { "Html Field 1", "Html Field 2", "No Filters In Meantime" };
        var filterExpressions = new Dictionary<RequiredString, IDslExpression<bool>>
        {
            { "  User.IsRetard  ", expr1.Object },
            { "User.IsGenius", expr2.Object },
            { "Assembly.IsVanilla", expr3.Object },
        };
        Target = new InlinedFiltersJustInTimeProcessor(namesOfFieldsWithFilters, filterExpressions);

        SetupContentFields(
            ("Html Field 1", "<div data-content-filter='  User.IsRetard  '>Retard</div>"
                             + "<div data-content-filter='User.IsGenius'>Genius</div>"),
            ("Ignored Field", "<div data-content-filter='User.Wtf'>Should be ignored because not specified in ctor.</div>"),
            ("Html Field 2", "<div data-content-filter='User.IsGenius'>"
                             + "Welcome <span data-content-filter='Assembly.IsVanilla'>Vanilla</span> developer.</div>"),
            ("No Filters In Meantime", "All filters have been removed in the meantime."));
    }

    private readonly Mock<IDslExpression<bool>> expr1;
    private readonly Mock<IDslExpression<bool>> expr2;
    private readonly Mock<IDslExpression<bool>> expr3;

    private async Task RunAndExpect(string htmlField1, string htmlField2)
    {
        var result = await Target_ProcessAsync(); // Act

        var doc = result.VerifySuccess(expectedMetadata: InputContent.Metadata);
        doc.Data.Fields.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "Html Field 1", htmlField1 },
            { "Ignored Field", "<div data-content-filter='User.Wtf'>Should be ignored because not specified in ctor.</div>" },
            { "Html Field 2", htmlField2 },
            { "No Filters In Meantime", "All filters have been removed in the meantime." },
        });
    }

    public void Dispose()
        => VerifyAllExpressionsEvaluated(Times.AtMostOnce);

    [Fact]
    public async Task ShouldEvaluateFullyOnServer()
    {
        expr2.Setup(e => e.EvaluateAsync(Mode)).ReturnsAsync(true);

        await RunAndExpect( // Act
            htmlField1: "<div>Genius</div>",
            htmlField2: "<div>Welcome  developer.</div>");
    }

    [Fact]
    public async Task ShouldEvaluatePartiallyForClient()
    {
        Options = TestContentLoadOptions.Get(DslEvaluation.PartialForClient);
        expr2.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromClientExpression("c.IQ > 160"));
        expr3.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(true));

        await RunAndExpect( // Act
            htmlField1: "<div data-content-filter='c.IQ > 160'>Genius</div>",
            htmlField2: "<div data-content-filter='c.IQ > 160'>Welcome <span>Vanilla</span> developer.</div>");
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldNotEvaluateExpressionInChildNodes_IfParentFilteredOut(DslEvaluation dslEvaluation)
    {
        Options = TestContentLoadOptions.Get(dslEvaluation);

        await RunAndExpect(htmlField1: "", htmlField2: ""); // Act

        expr3.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Never);
        expr3.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
    }

    [Fact]
    public async Task ShouldReturnSameContent_IfAllFiltersGoneInMeantime()
    {
        InputContent = InputContent.WithFieldsOverwritten(
            ("Html Field 1", "Nothing"),
            ("Html Field 2", null));

        await RunAndExpectSameContentAsync(); // Act

        VerifyAllExpressionsEvaluated(Times.Never);
    }

    [Fact]
    public async Task ShouldReturnInvalidContent_IfExecutionThrows()
    {
        var ex = new Exception("Oups");
        expr1.SetupWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode))).ThrowsAsync(ex);

        await RunAndExpectInvalidContentAsync(ex); // Act
    }

    [Fact]
    public async Task ShouldReturnInvalidContent_IfUnexpectedFilter()
    {
        InputContent = InputContent.WithFieldsOverwritten(
            ("Html Field 1", "<div data-content-filter='Omg.Wtf'>LOL</div>"));

        await RunAndExpectInvalidContentAsync("Field 'Html Field 1' contains data-content-filter='Omg.Wtf'"); // Act
    }

    private static void SetupExpression(out Mock<IDslExpression<bool>> expr)
    {
        expr = new Mock<IDslExpression<bool>>();
        expr.SetupWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode))).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(false));
    }

    private void VerifyAllExpressionsEvaluated(Func<Times> times)
        => new[] { expr1, expr2, expr3 }.Each(expr =>
        {
            expr.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), times);
            expr.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), times);
        });
}
