using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Testing;

internal static class HttpResponseVerificationExtensions
{
    public static string GetBodyString(this HttpResponse response)
        => ((MemoryStream)response.Body).ToArray().DecodeToString();

    public static void VerifyBody(this HttpResponse response, string expectedContentType, string expectedBody)
    {
        response.GetBodyString().Should().Be(expectedBody);
        response.ContentLength.Should().Be(response.Body.Length);
        response.ContentType.Should().Be(expectedContentType);
    }

    public static void VerifyEmptyBody(this HttpResponse response)
    {
        response.Body.Length.Should().Be(0);
        response.ContentLength.Should().BeNull();
        response.ContentType.Should().BeNull();
    }

    public static void VerifyRedirect(this HttpResponse response, string expectedLocation, bool expectedPermanent = false)
    {
        response.StatusCode.Should().Be(expectedPermanent ? StatusCodes.Status301MovedPermanently : StatusCodes.Status302Found);
        response.Headers[HttpHeaders.Location].ToString().Should().Be(expectedLocation);
        response.Headers[HttpHeaders.XRedirectSource].ToString().Should().NotBeNullOrWhiteSpace();
    }

    public static void VerifyNotChanged(this HttpResponse response)
    {
        response.StatusCode.Should().Be(StatusCodes.Status200OK);
        response.Headers.Should().BeEmpty();
        response.VerifyEmptyBody();
    }
}
