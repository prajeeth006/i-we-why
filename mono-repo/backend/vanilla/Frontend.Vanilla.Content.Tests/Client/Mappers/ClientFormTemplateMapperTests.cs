using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientFormTemplateMapperTests : ClientContentMapperTestsBase<IFormElementTemplate, ClientFormElement>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Metadata.Id).Returns("bla/Id");
        SourceDoc.SetupGet(s => s.Label).Returns("Sports Betting");
        SourceDoc.SetupGet(s => s.ToolTip).Returns("ToolTip");
        SourceDoc.SetupGet(s => s.Watermark).Returns("Watermark");
        var values = new List<ListItem> { new ListItem("test", "test") };
        SourceDoc.SetupGet(s => s.Values).Returns(values);
        Context.Setup(o => o.CreateListItemCollection(values)).Returns(new List<ClientListItem> { new ClientListItem() });
        var validation = SetupOptionalCollection(s => s.Validation);
        var htmlAttributes = SetupOptionalCollection(s => s.HtmlAttributes);

        await RunTest(new ClientFormElementTemplateMapper());

        TargetDoc.Id.Should().Be("id");
        TargetDoc.Label.Should().Be("client: Sports Betting");
        TargetDoc.ToolTip.Should().Be("client: ToolTip");
        TargetDoc.Watermark.Should().Be("client: Watermark");
        TargetDoc.Values.Count.Should().Be(1);
        TargetDoc.Validation.Should().BeSameAs(validation);
        TargetDoc.HtmlAttributes.Should().BeSameAs(htmlAttributes);
    }
}
