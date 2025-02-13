using System;
using System.Net;

namespace Frontend.Vanilla.Diagnostics.App.Infrastructure;

public class ApiException(string message, HttpStatusCode statusCode) : Exception(message)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
}
