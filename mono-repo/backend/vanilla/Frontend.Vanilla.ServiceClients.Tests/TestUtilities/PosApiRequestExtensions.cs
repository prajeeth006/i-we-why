#nullable enable

using System;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Tests.TestUtilities;

internal static class PosApiRequestExtensions
{
    public static void Verify(
        this PosApiRestRequest requestToVerify,
        string url,
        HttpMethod? method = null,
        bool authenticate = false,
        RestRequestHeaders? headers = null,
        bool hasContent = false,
        object? content = null)
    {
        requestToVerify.Should().NotBeNull();
        requestToVerify.Url.Should().Be(new Uri(url, UriKind.Relative));
        requestToVerify.Method.Should().Be(method ?? HttpMethod.Get);
        requestToVerify.Authenticate.Should().Be(authenticate);
        requestToVerify.Headers.Should().Equal(headers ?? new RestRequestHeaders());

        if (content != null)
            requestToVerify.Content.Should().BeSameAs(content);
        else if (hasContent)
            requestToVerify.Content.Should().NotBeNull();
        else
            requestToVerify.Content.Should().BeNull();
    }
}
