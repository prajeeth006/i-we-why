using System;
using FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public sealed class ContentLoadOptionsTests
{
    [Fact]
    public void Constructor_ShouldHaveReasonableDefaults()
    {
        var target = default(ContentLoadOptions);

        target.DslEvaluation.Should().Be(DslEvaluation.FullOnServer);
        target.PrefetchDepth.Should().Be(0);
        target.RequireTranslation.Should().BeFalse();
        target.BypassCache.Should().BeFalse();
        target.Revision.Should().BeNull();
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public void DslEvaluation_ShouldSetAndGetCorrectly(DslEvaluation dslEvaluation)
    {
        var target = new ContentLoadOptions { DslEvaluation = dslEvaluation };
        target.DslEvaluation.Should().Be(dslEvaluation);
    }

    [Fact]
    public void DslEvaluation_ShouldThrow_IfInvalid()
        => new Action(() => new ContentLoadOptions { DslEvaluation = (DslEvaluation)666 }).Should().Throw<ArgumentException>();

    [Theory]
    [InlineData(DslEvaluation.FullOnServer,
        0U,
        false,
        false,
        "test",
        "DslEvaluation = FullOnServer; PrefetchDepth = 0; RequireTranslation = False; BypassCache = False; Revision = test")]
    [InlineData(DslEvaluation.PartialForClient,
        666U,
        true,
        true,
        "test",
        "DslEvaluation = PartialForClient; PrefetchDepth = 666; RequireTranslation = True; BypassCache = True; Revision = test")]
    public void ToString_Test(DslEvaluation dslEvaluation, uint prefetchDepth, bool requireTranslation, bool bypassCache, string revision, string expected)
    {
        var target = new ContentLoadOptions
            { DslEvaluation = dslEvaluation, PrefetchDepth = prefetchDepth, RequireTranslation = requireTranslation, BypassCache = bypassCache, Revision = revision };
        target.ToString().Should().Be(expected);
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public void ImplicitOperator_ShouldCreateNewInstance(DslEvaluation dslEvaluation)
    {
        ContentLoadOptions target = dslEvaluation;
        target.Should().Be(new ContentLoadOptions { DslEvaluation = dslEvaluation });
    }

    [Fact]
    public void Disclaimer_Test()
        => ContentLoadOptions.Disclaimer.Should()
            .Be(
                "This rule is specified by developers of related feature using Vanilla API e.g. IContentService, ContentLoadOptions etc. Therefore ask them (you?) for explanation.");
}
