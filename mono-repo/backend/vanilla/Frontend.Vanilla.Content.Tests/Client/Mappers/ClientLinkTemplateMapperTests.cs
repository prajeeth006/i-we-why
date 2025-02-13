using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientLinkTemplateMapperTests : ClientContentMapperTestsBase<ILinkTemplate, ClientLinkTemplate>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Url).Returns(new Uri("http://sports.bwin.com"));
        SourceDoc.SetupGet(s => s.LinkText).Returns("Sports Betting");
        SourceDoc.SetupGet(s => s.Metadata.Id).Returns("bla/Name");
        var htmlAttributes = SetupOptionalCollection(s => s.HtmlAttributes);

        await RunTest(new ClientLinkTemplateMapper());

        TargetDoc.Url.Should().Be(new Uri("http://sports.bwin.com"));
        TargetDoc.LinkText.Should().Be("client: Sports Betting");
        TargetDoc.HtmlAttributes.Should().BeSameAs(htmlAttributes);
    }
}
