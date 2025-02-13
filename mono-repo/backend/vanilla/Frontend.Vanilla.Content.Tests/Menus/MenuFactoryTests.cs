using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.ProxyFolder;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Menus;

public class MenuFactoryTests
{
    private readonly IMenuFactory target;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IDslCompiler> dslCompiler;
    private readonly TestLogger<MenuFactory> log;
    private readonly List<ItemTestMetadata> sections;
    private readonly Dictionary<string, IDocument> items;
    private readonly CancellationToken ct;

    public class ItemTestMetadata
    {
        private readonly Dictionary<string, IDocument> itemLookup;
        public Mock<IDocument> Item { get; set; }
        public Mock<IDocumentMetadata> Metadata { get; set; }
        public List<ItemTestMetadata> Items { get; set; }

        public ItemTestMetadata(string path, Dictionary<string, IDocument> itemLookup)
        {
            this.itemLookup = itemLookup;
            Metadata = new Mock<IDocumentMetadata>();
            Items = new List<ItemTestMetadata>();

            Metadata.SetupGet(m => m.Id).Returns(path);
            Metadata.SetupGet(m => m.ChildIds).Returns(() => Items.Select(i => i.Metadata.Object.Id).ToList());
        }

        public ItemTestMetadata AddMenuItemTemplate(
            string path,
            string text,
            Dictionary<string, string> htmlAttributes = null,
            string linkText = null,
            Dictionary<string, string> linkHtmlAttributes = null,
            ContentImage image = null,
            string webAnalytics = null)
        {
            var item = new ItemTestMetadata($"{Metadata.Object.Id.Path}/{path}", itemLookup);

            var menuItem = new Mock<IMenuItemTemplate>();
            menuItem.SetupGet(i => i.LinkText).Returns(text);
            menuItem.SetupGet(i => i.HtmlAttributes).Returns(htmlAttributes?.AsContentParameters() ?? ContentParameters.Empty);
            menuItem.SetupGet(i => i.Metadata).Returns(item.Metadata.Object);
            menuItem.SetupGet(i => i.Image).Returns(image);
            menuItem.SetupGet(i => i.WebAnalytics).Returns(webAnalytics);

            if (!string.IsNullOrEmpty(linkText) || linkHtmlAttributes != null)
            {
                var link = new ContentLink(new Uri("http://url"), linkText, linkHtmlAttributes?.AsContentParameters() ?? ContentParameters.Empty);

                menuItem.SetupGet(i => i.LinkReference).Returns(link);
            }

            item.Item = menuItem.As<IDocument>();
            var fields = new Dictionary<string, object>
            {
                { "WebAnalytics", webAnalytics },
            };

            item.Item = menuItem.As<IDocument>();
            item.Item.SetupGet(d => d.Data).Returns(new DocumentData(item.Metadata.Object, fields));

            Items.Add(item);

            itemLookup.Add(item.Metadata.Object.Id.ToString(), item.Item.Object);

            return item;
        }

        public ItemTestMetadata AddMenuItem(
            string path,
            string text,
            Dictionary<string, string> parameters = null,
            Dictionary<string, string> resources = null,
            string linkText = null,
            Dictionary<string, string> linkHtmlAttributes = null,
            ContentImage image = null,
            string webAnalytics = null)
        {
            var item = new ItemTestMetadata($"{Metadata.Object.Id.Path}/{path}", itemLookup);

            var menuItem = new Mock<IMenuItem>();
            menuItem.SetupGet(i => i.Text).Returns(text);
            menuItem.SetupGet(i => i.Parameters).Returns(parameters?.AsContentParameters() ?? ContentParameters.Empty);
            menuItem.SetupGet(i => i.Resources).Returns(resources?.AsContentParameters() ?? ContentParameters.Empty);
            menuItem.SetupGet(i => i.Metadata).Returns(item.Metadata.Object);
            menuItem.SetupGet(i => i.Image).Returns(image);

            if (!string.IsNullOrEmpty(linkText) || linkHtmlAttributes != null)
            {
                var link = new ContentLink(new Uri("http://url"), linkText, linkHtmlAttributes?.AsContentParameters() ?? ContentParameters.Empty);

                menuItem.SetupGet(i => i.Link).Returns(link);
            }

            item.Item = menuItem.As<IDocument>();

            var fields = new Dictionary<string, object>
            {
                { "WebAnalytics", webAnalytics },
            };

            item.Item.SetupGet(d => d.Data).Returns(new DocumentData(item.Metadata.Object, fields));

            Items.Add(item);

            itemLookup.Add(item.Metadata.Object.Id.ToString(), item.Item.Object);

            return item;
        }

        public ItemTestMetadata AddProxyItem(string path, IEnumerable<ProxyRule> rules)
        {
            var item = new ItemTestMetadata($"{Metadata.Object.Id.Path}/{path}", itemLookup);

            var menuItem = new Mock<IProxy>();
            menuItem.SetupGet(i => i.Target).Returns(rules.ToList());

            item.Item = menuItem.As<IDocument>();

            Items.Add(item);

            itemLookup.Add(item.Metadata.Object.Id.ToString(), item.Item.Object);

            return item;
        }

        internal ItemTestMetadata AddProxyFolderChildItem(string path, IEnumerable<ProxyFolderChildItem> rules)
        {
            var item = new ItemTestMetadata($"{Metadata.Object.Id.Path}/{path}", itemLookup);

            var menuItem = new Mock<IVanillaProxyFolder>();
            menuItem.SetupGet(i => i.Target).Returns(rules.ToList());

            item.Item = menuItem.As<IDocument>();

            Items.Add(item);

            itemLookup.Add(item.Metadata.Object.Id.ToString(), item.Item.Object);

            return item;
        }

        public ItemTestMetadata AddPcImage(
            string path,
            string cssClass,
            string linkText,
            string url,
            Dictionary<string, string> parameters,
            string src,
            string alt,
            int width,
            int height,
            string webAnalytics = null)
        {
            var item = new ItemTestMetadata($"{Metadata.Object.Id}/{path}", itemLookup);

            var image = new Mock<IPCImage>();

            image.SetupGet(i => i.Metadata).Returns(item.Metadata.Object);
            image.SetupGet(i => i.Class).Returns(cssClass);
            image.SetupGet(i => i.Parameters).Returns(parameters?.AsContentParameters() ?? ContentParameters.Empty);

            var link = new ContentLink(new Uri(url, UriKind.RelativeOrAbsolute), linkText, ContentParameters.Empty);

            image.SetupGet(i => i.ImageLink).Returns(link);

            var img = new ContentImage(src, alt, width, height);

            image.SetupGet(i => i.Image).Returns(img);

            item.Item = image.As<IDocument>();

            var fields = new Dictionary<string, object>
            {
                { "WebAnalytics", webAnalytics },
            };

            item.Item.SetupGet(d => d.Data).Returns(new DocumentData(item.Metadata.Object, fields));

            Items.Add(item);

            itemLookup.Add(item.Metadata.Object.Id.ToString(), item.Item.Object);

            return item;
        }

        public ItemTestMetadata AddItem(string path, Mock<IDocument> doc, string webAnalytics = null)
        {
            var item = new ItemTestMetadata($"{Metadata.Object.Id.Path}/{path}", itemLookup);

            item.Item = doc;

            var fields = new Dictionary<string, object>
            {
                { "WebAnalytics", webAnalytics },
            };

            item.Item.SetupGet(d => d.Data).Returns(new DocumentData(item.Metadata.Object, fields));

            doc.SetupGet(d => d.Metadata).Returns(item.Metadata.Object);

            Items.Add(item);

            itemLookup.Add(item.Metadata.Object.Id.ToString(), item.Item.Object);

            return item;
        }
    }

    private ItemTestMetadata CreateSection(string path, string text, Dictionary<string, string> htmlAttributes = null, string webAnalytics = null)
    {
        var section = new ItemTestMetadata(path, items);

        var menuItem = new Mock<IMenuItem>();
        menuItem.SetupGet(i => i.Text).Returns(text);
        menuItem.SetupGet(i => i.Parameters).Returns(htmlAttributes?.AsContentParameters() ?? ContentParameters.Empty);
        menuItem.SetupGet(i => i.Metadata).Returns(section.Metadata.Object);

        section.Item = menuItem.As<IDocument>();

        var fields = new Dictionary<string, object>
        {
            { "WebAnalytics", webAnalytics },
        };

        section.Item = menuItem.As<IDocument>();
        section.Item.SetupGet(d => d.Data).Returns(new DocumentData(section.Metadata.Object, fields));

        sections.Add(section);

        contentService.Setup(s => s.GetChildrenAsync<IDocument>(section.Item.Object, ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(() => section.Items.Select(i => i.Item.Object).ToList());
        contentService.Setup(s => s.GetRequiredAsync<IDocument>(path, ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(section.Item.Object);

        return section;
    }

    public MenuFactoryTests()
    {
        contentService = new Mock<IContentService>();
        dslCompiler = new Mock<IDslCompiler>();
        log = new TestLogger<MenuFactory>();
        target = new MenuFactory(contentService.Object, log, dslCompiler.Object);
        sections = new List<ItemTestMetadata>();
        items = new Dictionary<string, IDocument>();
        ct = TestCancellationToken.Get();

        contentService.Setup(s => s.GetChildrenAsync<IDocument>("sections", ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(() => sections.Select(s => s.Item.Object).ToList());
        contentService.Setup(s => s.GetAsync<IDocument>(It.IsAny<IEnumerable<DocumentId>>(), ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(
            (IEnumerable<DocumentId> ids, CancellationToken cancellationToken, ContentLoadOptions o) => { return ids.Select(i => items[i.ToString()]).ToList(); });
    }

    [Fact]
    public async Task GetSections_ShouldGetMenuSectionsFromContent()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate("item1", "Item 1");
        section1.AddMenuItemTemplate("item2", "Item 2");

        var section2 = CreateSection("section2", "Section 2");

        section2.AddMenuItemTemplate("item1", "Item 1");

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu.Count.Should().Be(2);
        menu[0].Title.Should().Be("Section 1");
        menu[0].Items?.Count.Should().Be(2);
        menu[1].Title.Should().Be("Section 2");
        menu[1].Items?.Count.Should().Be(1);
    }

    [Fact]
    public async Task GetSection_ShouldGetASingleSectionFromContent()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate("item1", "Item 1");
        section1.AddMenuItemTemplate("item2", "Item 2");

        var menu = await target.GetSectionAsync("section1", DslEvaluation.FullOnServer, ct);

        menu?.Title.Should().Be("Section 1");
        menu?.Items?.Count.Should().Be(2);
    }

    [Fact]
    public async Task GetSections_ShouldSkipEmptySections()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate("item1", "Item 1");
        section1.AddMenuItemTemplate("item2", "Item 2");

        CreateSection("section2", "Section 2");

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu.Count.Should().Be(1);
        menu[0].Title.Should().Be("Section 1");
    }

    [Fact]
    public async Task ShouldPopulateSectionValues()
    {
        var section1 = CreateSection("section1", "Section 1", new Dictionary<string, string> { { "class", "cls" }, { "authstate", "{ authenticated: 'hide' }" } });

        section1.AddMenuItemTemplate("item1", "Item 1");

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu[0].Title.Should().Be("Section 1");
        menu[0].Authstate.Should().BeJson("{authenticated: 'hide'}");
        menu[0].Class.Should().Be("cls");
        menu[0].Name.Should().Be("section1");
    }

    [Fact]
    public async Task ShouldAllowToOverrideDefaultNameForSection()
    {
        var section1 = CreateSection("section1", "Section 1", new Dictionary<string, string> { { "name", "section10" } });

        section1.AddMenuItemTemplate("item1", "Item 1");

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu[0].Name.Should().Be("section10");
    }

    [Fact]
    public async Task ShouldPopulateMenuItemTemplateValues()
    {
        var section1 = CreateSection("section1", "Section 1");
        var image = new ContentImage("src", "alt", 1, 2);
        var webAnalytics = "should be a json string";

        section1.AddMenuItemTemplate(
            "item1",
            "Item 1",
            new Dictionary<string, string>
            {
                { "href", "url" }, { "rel", "nofollow" },
                { "target", "_blank" },
                { "class", "cls" },
                { "authstate", "{ authenticated: 'hide' }" },
                { "click-action", "action" },
                { "type", "itemType" },
                { "tracking.eventName", "eventName" },
                { "tracking.data.page.referringAction", "action" },
            },
            image: image,
            webAnalytics: webAnalytics);

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Text.Should().Be("Item 1");
        item.Authstate.Should().BeJson(
            @"{
    authenticated: 'hide'
}");
        item.Url.Should().Be("url");
        item.Target.Should().Be("_blank");
        item.Rel.Should().Be("nofollow");
        item.Class.Should().Be("cls");
        item.ClickAction.Should().Be("action");
        item.Type.Should().Be("itemType");
        item.Name.Should().Be("item1");
        item.Image.Should().BeSameAs(image);

        item.TrackEvent.Should().BeJson(@"{ 'eventName': 'eventName', 'data': { 'page.referringAction': 'action' } }");
        item.WebAnalytics.Should().Be(webAnalytics);
    }

    [Fact]
    public async Task ShouldPopulateMenuItemValues()
    {
        var section1 = CreateSection("section1", "Section 1");
        var image = new ContentImage("src", "alt", 1, 2);

        section1.AddMenuItem(
            "item1",
            "Item 1",
            new Dictionary<string, string>
            {
                { "href", "url" }, { "rel", "nofollow" },
                { "target", "_blank" },
                { "class", "cls" },
                { "authstate", "{ authenticated: 'hide' }" },
                { "click-action", "action" },
                { "type", "itemType" },
                { "tracking.eventName", "eventName" },
                { "tracking.data.page.referringAction", "action" },
                { "custom-param", "val" },
            },
            new Dictionary<string, string>
            {
                { "res", "Hello there" },
            },
            image: image);

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Text.Should().Be("Item 1");
        item.Authstate.Should().BeJson(
            @"{
    authenticated: 'hide'
}");
        item.Url.Should().Be("url");
        item.Target.Should().Be("_blank");
        item.Rel.Should().Be("nofollow");
        item.Class.Should().Be("cls");
        item.ClickAction.Should().Be("action");
        item.Type.Should().Be("itemType");
        item.Name.Should().Be("item1");
        item.Image.Should().BeSameAs(image);
        item.Parameters.Should().BeEquivalentTo(new Dictionary<string, string> { { "custom-param", "val" } });
        item.Resources.Should().BeEquivalentTo(new Dictionary<string, string> { { "res", "Hello there" } });

        item.TrackEvent.Should().BeJson(@"{ 'eventName': 'eventName', 'data': { 'page.referringAction': 'action' } }");
    }

    [Fact]
    public async Task ShouldPopulateMenuItemValuesFromLink()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate(
            "item1",
            null,
            null,
            "Item 1",
            new Dictionary<string, string> { { "class", "cls" }, { "authstate", "{ authenticated: 'hide' }" }, { "click-action", "action" }, { "type", "itemType" } });

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Text.Should().Be("Item 1");
        item.Authstate.Should().BeJson(
            @"{
    authenticated: 'hide'
}");
        item.Url.Should().Be(new Uri("http://url"));
        item.Class.Should().Be("cls");
        item.ClickAction.Should().Be("action");
        item.Type.Should().Be("itemType");
        item.Name.Should().Be("item1");
    }

    [Fact]
    public async Task ShouldOverrideAndExtendValuesFromLinkWithValuesFromMenuItem()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate(
            "item1",
            "Menu 1",
            new Dictionary<string, string> { { "class", "cls1" }, { "authstate", "{ authenticated: 'hide' }" }, { "click-action", "action" } },
            "Item 1",
            new Dictionary<string, string> { { "class", "cls" }, { "click-action", "action" } });

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Text.Should().Be("Menu 1");
        item.Authstate.Should().BeJson(
            @"{
    authenticated: 'hide'
}");
        item.Url.Should().Be("http://url");
        item.Class.Should().Be("cls1");
        item.ClickAction.Should().Be("action");
        item.Type.Should().BeNull();
        item.Name.Should().Be("item1");

        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldOverrideDefaultNameForMenuItem()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate("item1", "Item 1", new Dictionary<string, string> { { "name", "item10" } });

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Name.Should().Be("item10");
    }

    [Fact]
    public async Task ShouldPutExtraParametersToParameters()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate("item1", "Item 1", new Dictionary<string, string> { { "name", "item10" }, { "extra", "eval" } });

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Name.Should().Be("item10");
        item.Parameters.Should().Equal(new Dictionary<string, string> { { "extra", "eval" } });
    }

    [Fact]
    public async Task ShouldPopulatePcImageValues()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddPcImage(
            "img1",
            "cls",
            "Image 1",
            "url",
            new Dictionary<string, string> { { "authstate", "{ authenticated: 'hide' }" }, { "rel", "nofollow" }, { "target", "_blank" }, { "click-action", "action" } },
            "src",
            "alt",
            10,
            20);

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Text.Should().Be("Image 1");
        item.Authstate.Should().BeJson(
            @"{
    authenticated: 'hide'
}");
        item.Class.Should().Be("cls");
        item.ClickAction.Should().Be("action");
        item.Type.Should().Be("icon");
        item.Name.Should().Be("img1");
        item.Url.Should().Be("url");
        item.Target.Should().Be("_blank");
        item.Rel.Should().Be("nofollow");
        item.Image.Src.Should().Be("src");
        item.Image.Alt.Should().Be("alt");
        item.Image.Width.Should().Be(10);
        item.Image.Height.Should().Be(20);
    }

    [Fact]
    public async Task ShouldOverrideDefaultNameForPcImage()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddPcImage("img1", "cls", "Image 1", "url", new Dictionary<string, string> { { "name", "img10" } }, "src", "alt", 10, 20);

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        var item = menu[0].Items.First();

        item.Name.Should().Be("img10");
    }

    [Fact]
    public async Task ShouldLogErrorWhenAuthStateJsonIsInvalid()
    {
        var section1 = CreateSection("section1", "Section 1");

        section1.AddMenuItemTemplate("item1", "Item 1", new Dictionary<string, string> { { "authstate", "{ authenticated: 'hide'" } });

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu[0].Authstate.Should().BeNull();
        log.Logged.Single().Verify(
            LogLevel.Error,
            ex => ex is JsonReaderException,
            ("id", (DocumentId)"/section1/item1"),
            ("description", "attribute authstate"));
    }

    [Fact]
    public async Task ShouldLogErrorWhenItemIsUnknownTemplate()
    {
        var section1 = CreateSection("section1", "Section 1");

        var item = new Mock<IPCTeaser>();
        section1.AddItem("item1", item.As<IDocument>());
        section1.AddMenuItemTemplate("item2", "Item 2");

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu.Should().HaveCount(1);
        log.Logged.Single().Verify(
            LogLevel.Error,
            ("itemId", (DocumentId)"/section1/item1"),
            ("templateName", null));
    }

    [Fact]
    public async Task GetSections_ShouldLogErrorAndReturnEmptyCollectionWhenUnexpectedErrorOccurs()
    {
        var exception = new Exception("test");
        contentService.Setup(s => s.GetChildrenAsync<IDocument>("sections", ct, It.IsAny<ContentLoadOptions>())).ThrowsAsync(exception);

        var menu = await target.GetSectionsAsync("sections", DslEvaluation.FullOnServer, ct);

        menu.Should().BeEmpty();
        log.Logged.Single().Verify(LogLevel.Error, exception, ("path", (DocumentId)"sections"));
    }

    [Fact]
    public async Task GetSection_ShouldLogErrorAndReturnNullWhenUnexpectedErrorOccurs()
    {
        var exception = new Exception("test");
        contentService.Setup(s => s.GetRequiredAsync<IDocument>("section1", ct, It.IsAny<ContentLoadOptions>())).ThrowsAsync(exception);

        var menu = await target.GetSectionAsync("section1", DslEvaluation.FullOnServer, ct);

        menu.Should().BeNull();
        log.Logged.Single().Verify(LogLevel.Error, exception, ("path", (DocumentId)"section1"));
    }

    [Fact]
    public async Task GetOptionalSection_ShouldReturnNullIfNotFound()
    {
        contentService.Setup(s => s.GetAsync<IDocument>("section1", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync((IDocument)null);

        var menu = await target.GetOptionalSectionAsync("section1", DslEvaluation.FullOnServer, ct);

        menu.Should().BeNull();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task GetItem_ShouldGetTreeOfItemsRecursively()
    {
        var root = CreateSection("root", "Main");

        root.AddMenuItemTemplate("item1", "Item 1");
        var item2 = root.AddMenuItemTemplate("item2", "Item 2", new Dictionary<string, string> { { "menu-route", "route" } });

        var item21 = item2.AddMenuItemTemplate("item21", "Item 21");

        item21.AddMenuItemTemplate("item211", "Item 211");

        var item3 = root.AddMenuItemTemplate("item3", "Item 3");

        item3.AddPcImage("img1", "cls", "Image 1", "url", new Dictionary<string, string> { { "name", "img10" } }, "src", "alt", 10, 20);

        var menu = await target.GetItemAsync("root", DslEvaluation.FullOnServer, ct);

        menu.Text.Should().Be("Main");
        menu.Children[0].Text.Should().Be("Item 1");
        menu.Children[1].Text.Should().Be("Item 2");
        menu.Children[1].MenuRoute.Should().Be("route");
        menu.Children[1].Children[0].Text.Should().Be("Item 21");
        menu.Children[1].Children[0].Children[0].Text.Should().Be("Item 211");
        menu.Children[2].Text.Should().Be("Item 3");
        menu.Children[2].Children[0].Image.Src.Should().Be("src");
    }

    [Fact]
    public async Task GetItem_ShouldEvaluatDslExpressionsPrefixed()
    {
        var condition = new Mock<IDslExpression<object>>();
        condition.Setup(c => c.EvaluateAsync(ct)).ReturnsAsync(100);

        var clientEvaluationResult = ClientEvaluationResult<object>.FromClientExpression("c.Balance.AvailableBalance");
        condition.Setup(c => c.EvaluateForClientAsync(ct)).ReturnsAsync(clientEvaluationResult);

        dslCompiler.Setup(c => c.Compile<object>(It.IsAny<RequiredString>())).Returns(condition.Object.WithWarnings("Balance.AvailableBalance"));

        var root = CreateSection("root", "Main");

        root.AddMenuItemTemplate("item1", "Item 1", new Dictionary<string, string> { { "formula", "DSL: Balance.AvailableBalance" } });
        var item2 = root.AddMenuItemTemplate("item2", "Item 2", new Dictionary<string, string> { { "param2", "Param without DSL prefix." } });

        var menu = await target.GetItemAsync("root", DslEvaluation.FullOnServer, ct);
        menu.Children[0].Parameters.Should().Equal(new Dictionary<string, string> { { "formula", "100" } });

        menu = await target.GetItemAsync("root", DslEvaluation.PartialForClient, ct);
        menu.Children[0].Parameters.Should().Equal(new Dictionary<string, string> { { "formula", "c.Balance.AvailableBalance" } });

        menu.Children[1].Parameters.Should().Equal(new Dictionary<string, string> { { "param2", "Param without DSL prefix." } });
    }

    [Theory]
    [InlineData(false, "false")]
    [InlineData(true, "true")]
    [InlineData("otherVal", "otherVal")]
    public async Task GetItem_ShouldEvaluateFinalDslValue(object value, string expected)
    {
        var condition = new Mock<IDslExpression<object>>();
        var clientEvaluationResult = ClientEvaluationResult<object>.FromValue(value);
        condition.Setup(c => c.EvaluateForClientAsync(ct)).ReturnsAsync(clientEvaluationResult);

        dslCompiler.Setup(c => c.Compile<object>(It.IsAny<RequiredString>())).Returns(condition.Object.WithWarnings("Exp"));

        var root = CreateSection("root", "Main");

        root.AddMenuItemTemplate("item1", "Item 1", new Dictionary<string, string> { { "c", "DSL: Exp" } });

        var menu = await target.GetItemAsync("root", DslEvaluation.PartialForClient, ct);
        menu.Children[0].Parameters.Should().Equal(new Dictionary<string, string> { { "c", expected } });
    }

    [Fact]
    public async Task GetItem_ShouldSupportProxyItems()
    {
        var root = CreateSection("root", "Main");

        var proxy = root.AddProxyItem("item",
            new List<ProxyRule>
            {
                new ("cond1", "doc1"),
                new ("cond2", "doc2"),
            });

        var item1 = proxy.AddMenuItemTemplate("doc1", "Item 1");
        var item2 = proxy.AddMenuItemTemplate("doc2", "Item 2");

        contentService.Setup(c => c.GetRequiredAsync<IDocument>("doc1", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(item1.Item.Object);
        contentService.Setup(c => c.GetRequiredAsync<IDocument>("doc2", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(item2.Item.Object);

        var menu = await target.GetItemAsync("root", DslEvaluation.PartialForClient, ct);
        var menuProxy = menu.Children[0] as MenuProxyItem;

        menuProxy.IsProxy.Should().BeTrue();

        menuProxy.Rules[0].Condition.Should().Be("cond1");
        menuProxy.Rules[0].Document.Text.Should().Be("Item 1");
        menuProxy.Rules[1].Condition.Should().Be("cond2");
        menuProxy.Rules[1].Document.Text.Should().Be("Item 2");
        menuProxy.Children.Should().BeNull();
    }

    [Fact]
    public async Task GetItem_ShouldSupportProxyFolder()
    {
        var root = CreateSection("root", "Main");
        var doc1 = new Mock<IDocument>();
        doc1.SetupGet(d => d.Metadata.Id).Returns("doc1");
        var doc2 = new Mock<IDocument>();
        doc2.SetupGet(d => d.Metadata.Id).Returns("doc2");

        var proxyFolder = root.AddProxyFolderChildItem("item",
            new List<ProxyFolderChildItem>
            {
                new ("cond1", doc1.Object),
                new ("cond2", doc2.Object),
            });

        proxyFolder.AddMenuItemTemplate("doc1", "Item 1");
        proxyFolder.AddMenuItemTemplate("doc2", "Item 2");

        var menu = await target.GetItemAsync("root", DslEvaluation.PartialForClient, ct);
        var menuProxy = menu.Children[0] as MenuProxyItem;

        menuProxy.IsProxy.Should().BeTrue();

        menuProxy.Rules[0].Condition.Should().Be("cond1");
        menuProxy.Rules[1].Condition.Should().Be("cond2");
        menuProxy.Children.Should().BeNull();
    }

    [Fact]
    public async Task GetItem_ShouldLogErrorAndReturnNullWhenUnexpectedErrorOccurs()
    {
        var exception = new Exception("test");
        contentService.Setup(s => s.GetRequiredAsync<IDocument>("root", ct, It.IsAny<ContentLoadOptions>())).Throws(exception);

        var menu = await target.GetItemAsync("root", DslEvaluation.FullOnServer, ct);

        menu.Should().BeNull();
        log.Logged.Single().Verify(LogLevel.Error, exception, ("path", (DocumentId)"root"));
    }
}
