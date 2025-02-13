using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.RequireTranslation;
using Frontend.Vanilla.Content.Tests.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.RequireTranslation;

public class RequireTranslationJustInTimeProcessorTestsWithTracing() : RequireTranslationJustInTimeProcessorTests(true) { }

public class RequireTranslationJustInTimeProcessorTestsWithoutTracing() : RequireTranslationJustInTimeProcessorTests(false) { }

public abstract class RequireTranslationJustInTimeProcessorTests : JustInTimeContentProcessorTestsBase
{
    protected RequireTranslationJustInTimeProcessorTests(bool useTrace)
        : base(useTrace)
    {
        Target = RequireTranslationJustInTimeProcessor.Singleton;
    }

    [Fact]
    public async Task ShouldReturnInvalid_IfNotTranslated_WhenRequireTranslation()
    {
        Options = TestContentLoadOptions.Get(requireTranslation: true);

        // Act
        var result = await Target_ProcessAsync();

        result.Should().BeOfType<InvalidContent<IDocument>>()
            .Which.Errors.Should().Equal(RequireTranslationJustInTimeProcessor.ErrorMessage);
        Trace?.Single().Should().Be(RequireTranslationJustInTimeProcessor.FailedTrace);
    }

    [Fact]
    public async Task ShouldReturnNotFound_IfNotTranslated_WhenIncludeTranslation()
    {
        Options = TestContentLoadOptions.Get(includeTranslation: true);

        // Act
        var result = await Target_ProcessAsync();

        result.Should().BeOfType<NotFoundContent<IDocument>>();
        Trace?.Single().Should().Be(RequireTranslationJustInTimeProcessor.MissingTrace);
    }

    [Fact]
    public async Task ShouldReturnSame_IfTranslationNotRequested()
    {
        // Act
        await RunAndExpectSameContentAsync();

        Trace?.Single().Should().Be(RequireTranslationJustInTimeProcessor.PassedTrace);
    }
}
