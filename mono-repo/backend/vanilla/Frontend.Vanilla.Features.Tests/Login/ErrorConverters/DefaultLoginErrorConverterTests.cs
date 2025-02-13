using System;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Login.ErrorFormatters;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login.ErrorConverters;

public class DefaultLoginErrorConverterTests
{
    private TestLogger<DefaultLoginErrorConverter> logMock;
    private Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private DefaultLoginErrorConverter defaultConverter;

    public DefaultLoginErrorConverterTests()
    {
        logMock = new TestLogger<DefaultLoginErrorConverter>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();

        var user = new ClaimsPrincipal(new ClaimsIdentity());
        user.SetOrRemoveClaim(PosApiClaimTypes.TimeZoneId, "Pacific Standard Time");

        currentUserAccessorMock.Setup(x => x.User).Returns(user);

        defaultConverter = new DefaultLoginErrorConverter(currentUserAccessorMock.Object, logMock);
    }

    [Fact]
    public void ShouldConvertToDateTime()
    {
        var errorCodeHandler = new ErrorHandlerParameter
            { Name = "COOLOFF_END_DATE", Type = "DateTime", Format = "M/dd/yy, h:mm tt", FromTimeZoneId = "Eastern Standard Time", ToTimeZoneId = "local" };
        var newValue = defaultConverter.Convert("2020-01-01T13:45:30", errorCodeHandler);

        ((DateTime)newValue).Should().Be(Convert.ToDateTime("1/1/2020 10:45:30 AM"));
    }

    [Fact]
    public void ShouldConvertToDecimal()
    {
        var errorCodeHandler = new ErrorHandlerParameter { Name = "CURRENCY", Type = "Decimal" };
        var newValue = defaultConverter.Convert("520", errorCodeHandler);

        newValue.Should().Be(520);
    }
}
