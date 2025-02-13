using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientClientPCBaseComponentMapperMapperTests : ClientContentMapperTestsBase<IPCBaseComponent, ClientPCBaseComponent>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Metadata.TemplateName).Returns("pcShit");
        SourceDoc.SetupGet(s => s.Metadata.Id).Returns("root/folder/xxx");
        SourceDoc.SetupGet(s => s.Class).Returns("ui-pc-shit");
        SourceDoc.SetupGet(s => s.Title).Returns("Good Content");
        SourceDoc.SetupGet(s => s.TitleLink).Returns(TestContentLink.Get());
        var parameters = SetupOptionalCollection(s => s.Parameters);

        await RunTest(new ClientPcBaseComponentMapper());

        TargetDoc.TemplateName.Should().Be("pcShit");
        TargetDoc.Name.Should().Be("xxx");
        TargetDoc.Class.Should().Be("client: ui-pc-shit");
        TargetDoc.Title.Should().Be("client: Good Content");
        TargetDoc.TitleLink.Should().BeSameAs(SourceDoc.Object.TitleLink);
        TargetDoc.Parameters.Should().BeSameAs(parameters);
    }
}
