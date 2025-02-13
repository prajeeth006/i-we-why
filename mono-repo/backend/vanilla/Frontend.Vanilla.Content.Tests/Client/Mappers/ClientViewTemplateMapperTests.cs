using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientViewTemplateMapperTests : ClientContentMapperTestsBase<IViewTemplate, ClientViewTemplate>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Title).Returns("Test Page");
        SourceDoc.SetupGet(s => s.Text).Returns("This is a test page.");
        SourceDoc.SetupGet(s => s.Metadata.Id).Returns("bla/Name");
        var childIds = new List<DocumentId> { "bla/link1", "bla/view1", "bla/form1", "bla/form2" };
        SourceDoc.SetupGet(s => s.Metadata.ChildIds).Returns(childIds);
        Context.Setup(o => o.LoadAsync(childIds)).ReturnsAsync(
            new List<ClientDocument>
            {
                new ClientLinkTemplate { InternalId = "l1" },
                new ClientViewTemplate { InternalId = "v1" },
                new ClientFormElement { Id = "fid1" },
                new ClientFormElement { Id = "fid2" },
            });
        var messages = SetupOptionalCollection(s => s.Messages);
        var validation = SetupOptionalCollection(s => s.Validation);

        await RunTest(new ClientViewTemplateMapper());

        TargetDoc.Title.Should().Be("client: Test Page");
        TargetDoc.Text.Should().Be("client: This is a test page.");
        TargetDoc.InternalId.Should().Be("name");
        TargetDoc.Messages.Should().BeSameAs(messages);
        TargetDoc.Validation.Should().BeSameAs(validation);
        TargetDoc.Links.Count.Should().Be(1);
        TargetDoc.Children.Count.Should().Be(1);
        TargetDoc.Form.Count.Should().Be(2);
    }
}
