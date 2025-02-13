using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class ContentImageConverterTests : ConverterTestsBase<ContentImage>
{
    public ContentImageConverterTests()
        => Target = new ContentImageConverter();

    [Theory]
    [InlineData("<img src='http://sitecore/image.jpg' alt='Test' width='666' height='123' />", "http://sitecore/image.jpg", "Test", 666, 123)]
    [InlineData("<img src='http://sitecore/image.jpg' alt='' width='' height='' />", "http://sitecore/image.jpg", null, null, null)]
    [InlineData("<img src='http://sitecore/image.jpg' />", "http://sitecore/image.jpg", null, null, null)]
    public void ShouldConvertHtmlToImage(string inputHtml, string expectedSrc, string expectedAlt, int? expectedWidth, int? expectedHeight)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputHtml);

        var result = Target.Convert(Context.Object); // Act

        result.Src.Should().Be(expectedSrc);
        result.Alt.Should().Be(expectedAlt);
        result.Width.Should().Be(expectedWidth);
        result.Height.Should().Be(expectedHeight);
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnNull_IfNoHtml(string inputHtml)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputHtml);
        ConvertAndExpect(null); // Act
    }

    [Theory]
    [InlineData("<img alt='Missing src attribute' />")]
    [InlineData("< /> This is invalid XML <<<<<<")]
    public void ShouldThrow_IfInvalidHtml(string inputHtml)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputHtml);
        Target_Convert.Should().Throw(); // Act
    }
}
