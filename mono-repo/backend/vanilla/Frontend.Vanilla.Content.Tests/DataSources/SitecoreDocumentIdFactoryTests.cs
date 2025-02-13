using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.DataSources;

public class SitecoreDocumentIdFactoryTests
{
    [Theory]
    [InlineData("/label", "/", DocumentPathRelativity.ConfiguredRootNode)]
    [InlineData("/label/path", "/path", DocumentPathRelativity.ConfiguredRootNode)]
    [InlineData("/strip/path1/rest", "/rest", DocumentPathRelativity.ConfiguredRootNode)]
    [InlineData("strip/path2/rest", "/rest", DocumentPathRelativity.ConfiguredRootNode)]
    [InlineData("label/without-slash", "/without-slash", DocumentPathRelativity.ConfiguredRootNode)]
    [InlineData("/absolute", "/absolute", DocumentPathRelativity.AbsoluteRoot)]
    public void ShallCreateIdRelativeToConfiguredRoot(string inputPath, string expectedPath, DocumentPathRelativity expectedRelativity)
    {
        var culture = new CultureInfo("sw-KE");
        IDocumentIdFactory target =
            new SitecoreDocumentIdFactory(Mock.Of<IContentConfiguration>(c => c.RootNodePath == "/Label" && c.StrippedPaths == new[] { "strip/path1", "strip/path2" }));

        // Act
        var id = target.Create(inputPath, culture);

        id.Should().Be(new DocumentId(expectedPath, expectedRelativity, culture));
    }
}
