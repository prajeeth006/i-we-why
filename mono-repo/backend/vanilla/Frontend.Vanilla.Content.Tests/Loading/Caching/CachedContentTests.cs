using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Caching;

public class CachedContentTests
{
    [Fact]
    public void ShouldCreateWithProcessors_IfSuccessContent()
    {
        var content = TestContent.Get<IDocument>();
        var processors = new[] { Mock.Of<IJustInTimeContentProcessor>(), Mock.Of<IJustInTimeContentProcessor>() };

        var target = new CachedContent(content, processors); // Act

        target.Content.Should().BeSameAs(content);
        target.JustInTimeProcessors.Should().Equal(processors)
            .And.NotBeSameAs(processors, "collection should be copied");
    }

    [Theory, ClassData(typeof(NotSuccessStatuses))]
    public void ShouldCreateWithoutProcessors_IfNotSuccessContent(DocumentStatus status)
    {
        var content = TestContent.Get<IDocument>(status);
        var processors = new[] { Mock.Of<IJustInTimeContentProcessor>(), Mock.Of<IJustInTimeContentProcessor>() };

        var target = new CachedContent(content, processors); // Act

        target.Content.Should().BeSameAs(content);
        target.JustInTimeProcessors.Should().BeEmpty();
    }

    [Theory, EnumData(typeof(DocumentStatus))]
    public void ShouldCreateWithoutProcessors_IfNullProcessors(DocumentStatus status)
    {
        var content = TestContent.Get<IDocument>(status);

        var target = new CachedContent(content); // Act

        target.Content.Should().BeSameAs(content);
        target.JustInTimeProcessors.Should().BeEmpty();
    }
}
