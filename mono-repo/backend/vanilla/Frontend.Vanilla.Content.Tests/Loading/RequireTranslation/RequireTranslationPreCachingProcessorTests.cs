using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.RequireTranslation;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.RequireTranslation;

public class RequireTranslationPreCachingProcessorTestsWithTracing() : RequireTranslationPreCachingProcessorTests(true) { }

public class RequireTranslationPreCachingProcessorTestsWithoutTracing() : RequireTranslationPreCachingProcessorTests(false) { }

public abstract class RequireTranslationPreCachingProcessorTests : PreCachingContentProcessorTestsBase
{
    protected RequireTranslationPreCachingProcessorTests(bool useTrace)
        : base(useTrace)
    {
        Metadata.SetupGet(d => d.TemplateName).Returns("PC Text");
        SetupTemplate(hasTranslatableFields: true);
    }

    [Theory]
    [InlineData(66, false, RequireTranslationPreCachingProcessor.TraceMessages.Translated)]
    [InlineData(1, false, RequireTranslationPreCachingProcessor.TraceMessages.Translated)]
    [InlineData(0, true, RequireTranslationPreCachingProcessor.TraceMessages.MissingTranslation)]
    [InlineData(-1, true, RequireTranslationPreCachingProcessor.TraceMessages.MissingTranslation)]
    public void ShouldMissTranslation_AccordingToVersion(int version, bool expectedIsMissingTranslation, string expectedTraceMsg)
    {
        Metadata.SetupGet(d => d.Version).Returns(version);

        // Act
        RunAndExpect(expectedIsMissingTranslation, expectedTraceMsg);
    }

    [Fact]
    public void ShouldNotMissTranslation_IfNoFields()
    {
        SetupContentFields();
        RunAndExpectCantBeTranslated();
    }

    [Fact]
    public void ShouldNotMissTranslation_IfAllFieldsShared()
    {
        SetupTemplate(hasTranslatableFields: false);
        RunAndExpectCantBeTranslated();
    }

    private void RunAndExpectCantBeTranslated()
        => RunAndExpect(isMissingTranslation: false, RequireTranslationPreCachingProcessor.TraceMessages.NotTranslatable);

    private void RunAndExpect(bool isMissingTranslation, string expectedTraceMsg)
    {
        RunAndExpectSameContent(); // Act

        AddedJitProcessor.Should().BeSameAs(isMissingTranslation ? RequireTranslationJustInTimeProcessor.Singleton : null);
        Trace?.Single().Should().Be(expectedTraceMsg);
    }

    private void SetupTemplate(bool hasTranslatableFields)
    {
        var template = TestSitecoreTemplate.Get(Metadata.Object.TemplateName, fields: new[]
        {
            TestSitecoreTemplate.GetField(shared: true),
            TestSitecoreTemplate.GetField(shared: !hasTranslatableFields),
        });
        Target = new RequireTranslationPreCachingProcessor(Mock.Of<IReflectionTemplatesSource>(s => s.Templates == new[] { template }));
    }
}
