using System.Diagnostics;
using System.Net;
using System.Net.Security;
using Frontend.Vanilla.Core.System;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

internal static class HttpForwarder
{
    internal static class MessageInvoker
    {
        public static HttpMessageInvoker Singleton { get; } = new (new SocketsHttpHandler
        {
            SslOptions = VanillaEnvironment.IsDev ? new SslClientAuthenticationOptions
            {
                RemoteCertificateValidationCallback = (_, _, _, _) => true,
            }
            : null,
            UseProxy = false,
            AllowAutoRedirect = true,
            AutomaticDecompression = DecompressionMethods.None,
            UseCookies = false,
            ActivityHeadersPropagator = new ReverseProxyPropagator(DistributedContextPropagator.Current),
        });
    }

    internal static class Transformer
    {
        public static CopyAllRequestHeadersTransformer CopyAllRequestHeadersSingleton { get; } = new ();
    }

    internal static class RequestConfig
    {
        public static ForwarderRequestConfig Singleton { get; } = new ();
    }
}
