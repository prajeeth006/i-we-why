using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Placeholders;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Placeholders;

public class PlaceholdersJustInTimeProcessorTestsA : PlaceholdersJustInTimeProcessorTests
{
    public PlaceholdersJustInTimeProcessorTestsA()
        : base(true, DslEvaluation.FullOnServer) { }
}

public class PlaceholdersJustInTimeProcessorTestsB : PlaceholdersJustInTimeProcessorTests
{
    public PlaceholdersJustInTimeProcessorTestsB()
        : base(false, DslEvaluation.FullOnServer) { }
}

public class PlaceholdersJustInTimeProcessorTestsC : PlaceholdersJustInTimeProcessorTests
{
    public PlaceholdersJustInTimeProcessorTestsC()
        : base(true, DslEvaluation.PartialForClient) { }
}

public class PlaceholdersJustInTimeProcessorTestsD : PlaceholdersJustInTimeProcessorTests
{
    public PlaceholdersJustInTimeProcessorTestsD()
        : base(false, DslEvaluation.PartialForClient) { }
}

public abstract class PlaceholdersJustInTimeProcessorTests : JustInTimeContentProcessorTestsBase
{
    private readonly DslEvaluation dslEvaluation;

    public PlaceholdersJustInTimeProcessorTests(bool useTrace, DslEvaluation dslEvaluation)
        : base(useTrace)
    {
        this.dslEvaluation = dslEvaluation;
        replacer = new Mock<IPlaceholderReplacer>();
        fieldReplacer1 = new Mock<IFieldPlaceholderReplacer>();
        fieldReplacer2 = new Mock<IFieldPlaceholderReplacer>();
        fieldReplacer3 = new Mock<IFieldPlaceholderReplacer>();
        placeholderExpr1 = new Mock<IDslExpression<object>>();
        placeholderExpr2 = new Mock<IDslExpression<object>>();
        placeholderExpr3 = new Mock<IDslExpression<object>>();
        Options = TestContentLoadOptions.Get(dslEvaluation);
        testEx = new Exception("Oups");

        fieldsToReplace = new Dictionary<string, IFieldPlaceholderReplacer>
        {
            { "Field 1", fieldReplacer1.Object },
            { "Field 2", fieldReplacer2.Object },
            { "Field 3", fieldReplacer3.Object },
        };
        placeholders = new Dictionary<TrimmedRequiredString, IDslExpression<object>>
        {
            { "Plc 1.1", placeholderExpr1.Object },
            { "Plc 1.2", placeholderExpr1.Object },
            { "Plc 2", placeholderExpr2.Object },
            { "Plc 3", placeholderExpr3.Object },
        };
        SetupTarget();

        SetupContentFields(
            ("Field 1", "Obj 1"),
            ("Field 2", "Obj 2"),
            ("Field 3", "Obj 3"));

        fieldReplacer1.Setup(r => r.GetReplaceableStrings("Obj 1")).Returns(new[] { "Hello Plc 1.2", "No placeholder" });
        fieldReplacer2.Setup(r => r.GetReplaceableStrings("Obj 2")).Returns(new[] { "Also no placeholder" });
        fieldReplacer3.Setup(r => r.GetReplaceableStrings("Obj 3")).Returns(new[] { "Plc 1.2 is OK", "Also Plc 3 and Plc 1.1" });

        if (dslEvaluation == DslEvaluation.FullOnServer)
        {
            placeholderExpr1.Setup(e => e.EvaluateAsync(Mode)).ReturnsAsync(666);
            placeholderExpr3.Setup(e => e.EvaluateAsync(Mode)).ReturnsAsync("Evaluated");
        }
        else
        {
            placeholderExpr1.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<object>.FromValue(666));
            placeholderExpr3.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<object>.FromClientExpression("ClientExpr"));
        }

        var expectedPlaceholders = new Dictionary<TrimmedRequiredString, ClientEvaluationResult<object>>
        {
            { "Plc 1.1", ClientEvaluationResult<object>.FromValue(666) },
            { "Plc 1.2", ClientEvaluationResult<object>.FromValue(666) },
            {
                "Plc 3",
                dslEvaluation == DslEvaluation.FullOnServer
                    ? ClientEvaluationResult<object>.FromValue("Evaluated")
                    : ClientEvaluationResult<object>.FromClientExpression("ClientExpr")
            },
        };
        replacer.Setup(r => r.Replace("Hello Plc 1.2", ItIs.Equivalent(expectedPlaceholders))).Returns("Hello Replaced");
        replacer.Setup(r => r.Replace("No placeholder", ItIs.Equivalent(expectedPlaceholders))).Returns("No placeholder");
        replacer.Setup(r => r.Replace("Plc 1.2 is OK", ItIs.Equivalent(expectedPlaceholders))).Returns("Replaced is OK");
        replacer.Setup(r => r.Replace("Also Plc 3 and Plc 1.1", ItIs.Equivalent(expectedPlaceholders))).Returns("Also Replaced and Replaced");

        var expectedReplacedStrs = new Dictionary<string, string>
        {
            { "No placeholder", "No placeholder" }, // Must be present so that field replacer can easily recreate the field
            { "Hello Plc 1.2", "Hello Replaced" },
            { "Plc 1.2 is OK", "Replaced is OK" },
            { "Also Plc 3 and Plc 1.1", "Also Replaced and Replaced" },
        }.ToHashSet();
        fieldReplacer1.Setup(r => r.Recreate("Obj 1", It.Is<ReplacedStringMapping>(s => expectedReplacedStrs.SetEquals(s.Strings)))).Returns("Replaced Obj 1");
        fieldReplacer3.Setup(r => r.Recreate("Obj 3", It.Is<ReplacedStringMapping>(s => expectedReplacedStrs.SetEquals(s.Strings)))).Returns("Replaced Obj 3");
    }

    private Dictionary<string, IFieldPlaceholderReplacer> fieldsToReplace;
    private Dictionary<TrimmedRequiredString, IDslExpression<object>> placeholders;
    private Mock<IPlaceholderReplacer> replacer;
    private Mock<IFieldPlaceholderReplacer> fieldReplacer1;
    private Mock<IFieldPlaceholderReplacer> fieldReplacer2;
    private Mock<IFieldPlaceholderReplacer> fieldReplacer3;
    private Mock<IDslExpression<object>> placeholderExpr1;
    private Mock<IDslExpression<object>> placeholderExpr2;
    private Mock<IDslExpression<object>> placeholderExpr3;
    private Exception testEx;

    private void SetupTarget() => Target = new PlaceholdersJustInTimeProcessor(replacer.Object, fieldsToReplace, placeholders);

    [Fact]
    public async Task ShouldReplacePlaceholdersInRespectiveFields()
    {
        var result = await Target_ProcessAsync(); // Act

        result.VerifySuccess(expectedMetadata: InputContent.Metadata);
        result.Should().BeOfType<SuccessContent<IDocument>>()
            .Which.Document.Data.Fields.Should().BeEquivalentTo(new Dictionary<string, object>
            {
                { "Field 1", "Replaced Obj 1" },
                { "Field 2", "Obj 2" },
                { "Field 3", "Replaced Obj 3" },
            });

        placeholderExpr1.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Exactly(dslEvaluation == DslEvaluation.FullOnServer ? 1 : 0));
        placeholderExpr1.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Exactly(dslEvaluation == DslEvaluation.PartialForClient ? 1 : 0));
        placeholderExpr2.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr2.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr3.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Exactly(dslEvaluation == DslEvaluation.FullOnServer ? 1 : 0));
        placeholderExpr3.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Exactly(dslEvaluation == DslEvaluation.PartialForClient ? 1 : 0));

        replacer.VerifyWithAnyArgs(r => r.Replace(null, null), Times.Exactly(4));

        fieldReplacer1.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Once);
        fieldReplacer1.VerifyWithAnyArgs(r => r.Recreate(null, null), Times.Once);
        fieldReplacer2.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Once);
        fieldReplacer2.VerifyWithAnyArgs(r => r.Recreate(null, null), Times.Never);
        fieldReplacer3.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Once);
        fieldReplacer3.VerifyWithAnyArgs(r => r.Recreate(null, null), Times.Once);
    }

    [Fact]
    public async Task ShouldReturnInvalidContent_IfFieldReplacer_GetReplaceableStringsFails()
    {
        fieldReplacer1.SetupWithAnyArgs(r => r.GetReplaceableStrings(null)).Throws(testEx);
        await RunAndExpectInvalidContentAsync(testEx); // Act
    }

    [Fact]
    public async Task ShouldReturnInvalidContent_IfFieldReplacer_RecreateFails()
    {
        fieldReplacer1.SetupWithAnyArgs(r => r.Recreate(null, null)).Throws(testEx);
        await RunAndExpectInvalidContentAsync(testEx); // Act
    }

    [Fact]
    public async Task ShouldReturnInvalidContent_IfDslEvaluationFails()
    {
        if (dslEvaluation == DslEvaluation.FullOnServer)
            placeholderExpr1.Setup(e => e.EvaluateAsync(Mode)).Throws(testEx);
        else
            placeholderExpr1.Setup(e => e.EvaluateForClientAsync(Mode)).Throws(testEx);

        await RunAndExpectInvalidContentAsync(testEx); // Act
    }

    [Fact]
    public async Task ShouldReturnInvalidContent_IfReplacerFailsd()
    {
        replacer.SetupWithAnyArgs(r => r.Replace(null, null)).Throws(testEx);
        await RunAndExpectInvalidContentAsync(testEx); // Act
    }

    [Fact]
    public async Task ShouldReturnSameContent_IfNoPlaceholdersFound()
    {
        fieldReplacer1.Setup(r => r.GetReplaceableStrings("Obj 1")).Returns(new[] { "Nothing", "Also here" });
        fieldReplacer3.Setup(r => r.GetReplaceableStrings("Obj 3")).Returns(new[] { "Plain text" });

        await RunAndExpectSameContentAsync(); // Act

        placeholderExpr1.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr1.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr2.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr2.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr3.VerifyWithAnyArgs(e => e.EvaluateAsync(default(ExecutionMode)), Times.Never);
        placeholderExpr3.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
    }

    [Fact]
    public void Ctor_ShouldThrow_IfEmptyPlaceholders()
    {
        placeholders.Clear();
        new Action(SetupTarget).Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Ctor_ShouldThrow_IfEmptyFields()
    {
        fieldsToReplace.Clear();
        new Action(SetupTarget).Should().Throw<ArgumentException>();
    }
}
