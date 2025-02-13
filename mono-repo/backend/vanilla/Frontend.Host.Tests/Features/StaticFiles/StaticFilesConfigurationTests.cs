using FluentAssertions;
using Frontend.Host.Features.SiteRootFiles;
using Xunit;

namespace Frontend.Host.Tests.Features.StaticFiles;

public sealed class StaticFilesConfigurationTests
{
    [Fact]
    public void ShouldContainDefaultContentTypes()
    {
        StaticFilesOptions.ContentTypes[".js"].Name.Should().Be("text/javascript");
    }

    [Fact]
    public void ShouldContainInternalRequestContentTypes()
    {
        StaticFilesOptions.ContentTypes[".map"].IsRestrictedToInternalRequest.Should().BeTrue();
    }

    [Theory]
    [InlineData(false, "")]
    [InlineData(true, "")]
    [InlineData(false, "  ")]
    [InlineData(true, "  ")]
    [InlineData(false, "not-ext")]
    [InlineData(true, "not-ext")]
    [InlineData(false, ".white space")]
    [InlineData(true, ".white space")]
    public void ShouldValidateKeys(bool addOrSet, string key)
        => RunErrorTest(addOrSet, key, new StaticFileContentType("memes/lol"), expectedError: $"Invalid file extension '{key}' for content type 'memes/lol'.");

    [Theory]
    [InlineData(false, "")]
    [InlineData(true, "")]
    [InlineData(false, "  ")]
    [InlineData(true, "  ")]
    public void ShouldValidateValue(bool addOrSet, string value)
        => RunErrorTest(
            addOrSet,
            ".lol",
            new StaticFileContentType(value),
            expectedError: "Content type for file extension '.lol' can't be null nor white-space. To block particular extension just don't put it in this dictionary.");

    private void RunErrorTest(bool addOrSet, string key, StaticFileContentType value, string expectedError)
    {
        var act = () =>
        {
            if (addOrSet)
                StaticFilesOptions.ContentTypes.Add(key, value);
            else
                StaticFilesOptions.ContentTypes[key] = value;
        };

        act.Should().Throw<ArgumentException>().WithMessage(expectedError);
    }
}
