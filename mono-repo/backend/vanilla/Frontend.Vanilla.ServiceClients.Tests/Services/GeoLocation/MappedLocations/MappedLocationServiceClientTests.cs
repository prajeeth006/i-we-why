#nullable enable

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.GeoLocation.MappedLocations;

public class MappedLocationServiceClientTests
{
    private readonly IMappedLocationServiceClient target;
    private readonly Mock<IPosApiRestClient> restClient;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly TestLogger<MappedLocationServiceClient> log;

    private readonly CancellationToken ct;

    public MappedLocationServiceClientTests()
    {
        restClient = new Mock<IPosApiRestClient>();
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>();
        log = new TestLogger<MappedLocationServiceClient>();
        target = new MappedLocationServiceClient(restClient.Object, currentUserAccessor, log);

        ct = TestCancellationToken.Get();
        currentUserAccessor.User = new ClaimsPrincipal();
    }

    public static TheoryData<GeolocationCoordinates, string> TestCases => new TheoryData<GeolocationCoordinates, string>
    {
        {
            // All parameters should be serialized correctly
            new GeolocationCoordinates(latitude: 1.2m, longitude: 2.1m, altitude: 3, accuracy: 4, altitudeAccuracy: 5, heading: 6, speed: 7),
            "GeoLocation.svc/mappedLocation?latitude=1.2&longitude=2.1&altitude=3&accuracy=4&altitudeAccuracy=5&heading=6&speed=7"
        },
        {
            // Parameters with null value should not be passed
            new GeolocationCoordinates(latitude: 46.12m, longitude: 16.45m, altitude: 58),
            "GeoLocation.svc/mappedLocation?latitude=46.12&longitude=16.45&altitude=58&accuracy=0"
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    public async Task ShouldMapLocationCorrectly(GeolocationCoordinates coords, string expectedUrl)
    {
        TestCulture.Set("de-AT"); // Formats numbers with comma
        var testLoc = new MappedGeolocation("Laufhaus Wien Mitte");
        restClient.Setup(c => c.ExecuteAsync<MappedGeolocation>(It.IsAny<PosApiRestRequest>(), ct)).ReturnsAsync(testLoc);

        // Act
        var location = await target.GetAsync(coords, ct);

        location.Should().BeSameAs(testLoc);
        restClient.Invocations.Single().Arguments[0].Should().BeEquivalentTo(new PosApiRestRequest(new PathRelativeUri(expectedUrl)));
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldPassAuthTokens_IfAuthenticated()
    {
        currentUserAccessor.User.AddClaim(PosApiClaimTypes.UserToken, "usr");
        currentUserAccessor.User.AddClaim(PosApiClaimTypes.SessionToken, "sess");

        // Act
        await target.GetAsync(new GeolocationCoordinates(), ct);

        var req = (PosApiRestRequest)restClient.Invocations.Single().Arguments[0];
        var expect = new Dictionary<string, StringValues>();
        expect.Add(PosApiHeaders.UserToken, "usr");
        expect.Add(PosApiHeaders.SessionToken, "sess");

        req.Headers.Should().BeEquivalentTo(expect);
    }

    [Theory]
    [InlineData(MappedLocationServiceClient.ErrorCodes.NoLocationMatched, false)]
    [InlineData(MappedLocationServiceClient.ErrorCodes.AccuracyOutOfLimits, true)]
    [InlineData(MappedLocationServiceClient.ErrorCodes.MultipleLocationsMatched, true)]
    public async Task ShouldReturnNull_IfParticularPosApiCode(int posApiCode, bool expectedWarning)
    {
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync<MappedGeolocation>(null!, TestContext.Current.CancellationToken))
            .ThrowsAsync(new PosApiException(posApiCode: posApiCode, posApiMessage: "Blah blah"));

        // Act
        var location = await target.GetAsync(new GeolocationCoordinates(), ct);

        location.Should().BeNull();

        if (expectedWarning)
            log.Logged.Single().Verify(LogLevel.Warning, ("posApiCode", posApiCode), ("posApiMessage", "Blah blah"));
        else
            log.VerifyNothingLogged();
    }

    public static IEnumerable TestExceptions => new[] { new Exception("Oups"), new PosApiException(posApiCode: 66) };

    [Theory, MemberValuesData(nameof(TestExceptions))]
    public async Task ShouldRethrow_IfDifferentException(Exception ex)
    {
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync<MappedGeolocation>(null!, TestContext.Current.CancellationToken)).ThrowsAsync(ex);

        Func<Task> act = () => target.GetAsync(new GeolocationCoordinates(), ct);

        (await act.Should().ThrowAsync<Exception>()).SameAs(ex);
    }
}
