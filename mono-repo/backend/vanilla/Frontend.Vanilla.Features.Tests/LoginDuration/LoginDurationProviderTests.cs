using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LoginDuration;

public class LoginDurationProviderTests
{
    private readonly ILoginDurationProvider target;
    private readonly Mock<ILoginDurationConfiguration> loginConfigMock;
    private readonly Mock<IContentService> contentServiceMock;
    private readonly CancellationToken ct;

    public LoginDurationProviderTests()
    {
        contentServiceMock = new Mock<IContentService>();
        loginConfigMock = new Mock<ILoginDurationConfiguration>();
        ct = TestCancellationToken.Get();

        loginConfigMock.SetupGet(c => c.SlotName).Returns("header_slot");
        loginConfigMock.SetupGet(c => c.TimeFormat).Returns("HMS");
        contentServiceMock.Setup(s => s.GetRequiredStringAsync(
                LoginDurationProvider.ContentPath,
                ItIs.Expression((IGenericListItem i) => i.VersionedList[LoginDurationProvider.ListItem]),
                ct))
            .ReturnsAsync("LoginDuration: {duration}");

        target = new LoginDurationProvider(loginConfigMock.Object, contentServiceMock.Object);
    }

    [Fact]
    public async Task GetTextAsync_ShouldReturnResult()
    {
        var result = await target.GetTextAsync(ct);

        result.Should().Be("LoginDuration: {duration}");
    }

    [Fact]
    public void SlotName_ShouldReturnConfigurationValue()
    {
        var result = target.SlotName;

        result.Should().Be("header_slot");
    }

    [Fact]
    public void TimeFormat_ShouldReturnConfigurationValue()
    {
        var result = target.TimeFormat;

        result.Should().Be("HMS");
    }
}
