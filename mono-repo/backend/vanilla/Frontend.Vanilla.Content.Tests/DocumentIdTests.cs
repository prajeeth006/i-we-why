using System;
using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class DocumentIdTests
{
    public DocumentIdTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
    }

    public static IEnumerable<object[]> TestCases => new[] { "test/item", "TEST/Item", "test/item/" }.ToTestCases()
        .CombineWith(DocumentPathRelativity.AbsoluteRoot, DocumentPathRelativity.ConfiguredRootNode);

    [Theory, MemberData(nameof(TestCases))]
    public void Constructor_ShouldCreateCorrectly(
        string path,
        DocumentPathRelativity relativity)
    {
        var id = new DocumentId(path, relativity, new CultureInfo("sw-KE"));

        id.Path.Should().Be("/test/item");
        id.PathRelativity.Should().Be(relativity);
        id.Culture.Should().Be(new CultureInfo("sw-KE"));
        id.Culture.IsReadOnly.Should().BeTrue();
    }

    [Fact]
    public void Constructor_ShouldUseDefaults()
    {
        var id = new DocumentId("Test/1");

        id.Path.Should().Be("/test/1");
        id.PathRelativity.Should().Be(DocumentPathRelativity.ConfiguredRootNode);
        id.Culture.Should().Be(CultureInfo.CurrentCulture);
    }

    [Theory]
    [InlineData(DocumentPathRelativity.AbsoluteRoot, "(AbsoluteRoot)/folder/item - sw-KE")]
    [InlineData(DocumentPathRelativity.ConfiguredRootNode, "/folder/item - sw-KE")]
    public void ToString_ShouldContainAllDetails(DocumentPathRelativity relativity, string expected)
    {
        var id = new DocumentId("folder/item", relativity, new CultureInfo("sw-KE"));
        id.ToString().Should().Be(expected);
    }

    [Fact]
    public void ImplicitOperator_ShouldCreateDocumentId()
    {
        DocumentId id = "test";

        id.Path.Should().Be("/test");
        id.Culture.Should().Be(new CultureInfo("zh-CN"));
        id.PathRelativity.Should().Be(DocumentPathRelativity.ConfiguredRootNode);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void ImplicitOperator_ShouldThrow_IfNoPath(string path)
        => new Func<object>(() => (DocumentId)path)
            .Should().Throw<ArgumentException>();

    [Theory]
    [InlineData("/", "")]
    [InlineData("/root", "root")]
    [InlineData("/Root/Folder/item", "item")]
    public void ItemName_ShouldReturnLastPartOfPath(string path, string expected)
    {
        var id = new DocumentId(path);
        id.ItemName.Should().Be(expected);
    }

    [Fact]
    public void ShouldBeUniquePerAllProperties()
        => EqualityTest.ExpectUniqueItems(
            5,
            /* 0 */ "Folder/ItemXXX", // Unique
            /* 1 */ "Folder/ItemYYY", // Unique
            /* 2 */ "/folder/ITEMxxx", // Equal to 0, different letter casing
            /* 3 */ new DocumentId("Folder/ItemXXX", culture: new CultureInfo("sw-KE")), // Unique
            /* 4 */ new DocumentId("Folder/ItemXXX", DocumentPathRelativity.AbsoluteRoot), // Unique
            /* 5 */ new DocumentId("Folder/ItemXXX", DocumentPathRelativity.AbsoluteRoot, new CultureInfo("sw-KE"))); // Unique

    [Theory]
    [InlineData("/app-v1/folder/item", "/app-v1/folder")]
    [InlineData("/app-v1/folder", "/app-v1")]
    [InlineData("/app-v1", "/")]
    [InlineData("/", null)]
    public void Parent_ShouldCalculateCorrectly(string path, string expectedParentPath)
    {
        var id = new DocumentId(path, RandomGenerator.Get<DocumentPathRelativity>(), TestCulture.GetRandom());

        id.Parent.Should().Be(expectedParentPath != null
            ? new DocumentId(expectedParentPath, id.PathRelativity, id.Culture)
            : null);
        id.Parent.Should().BeSameAs(id.Parent, "should be cached");
    }
}
