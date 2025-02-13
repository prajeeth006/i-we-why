using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class InternalLanguagesResolverTests
{
    private IInternalLanguagesResolver target;
    private Mock<IGlobalizationConfiguration> config;
    private Mock<IInternalRequestEvaluator> requestEvaluator;

    public InternalLanguagesResolverTests()
    {
        config = new Mock<IGlobalizationConfiguration>();
        requestEvaluator = new Mock<IInternalRequestEvaluator>();
        target = new InternalLanguagesResolver(config.Object, requestEvaluator.Object);

        config.SetupGet(c => c.InternalLanguages).Returns(new[] { TestLanguageInfo.Get(), TestLanguageInfo.Get() });
    }

    [Fact]
    public void ShouldReturnAllInternalLanguages_IfInternalRequest()
    {
        requestEvaluator.Setup(r => r.IsInternal()).Returns(true);

        // Act
        var result = target.Resolve();

        config.VerifyGet(c => c.InternalLanguages, Times.Never); // Should be lazily evaluated
        result.Should().Equal(config.Object.InternalLanguages);
    }

    [Fact]
    public void ShouldReturnEmpty_IfNotInternalRequest()
    {
        // Act
        target.Resolve().Should().BeEmpty();

        config.VerifyGet(c => c.InternalLanguages, Times.Never);
    }
}
