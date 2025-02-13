using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Net;

namespace Frontend.Gantry.Shared.Middlewares
{
    public class GantryApiExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        IInternalRequestEvaluator _internalRequestEvaluator;
        private static readonly ILoggerFactory _loggerFactory = new LoggerFactory();
        private static readonly ILogger _logger = new Logger<GantryApiExceptionMiddleware>(_loggerFactory);
        public GantryApiExceptionMiddleware(RequestDelegate next,
            IInternalRequestEvaluator internalRequestEvaluator)
        {
            _next = next;
            _internalRequestEvaluator = internalRequestEvaluator;
        }
        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }
        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            if (exception == null) return;
            _logger.LogError(exception,"Unexpected error occurred.");

            var errorMessageError = GenerateMessage(exception);

            context.Response.ContentType = "application/json";
            var result = new ObjectResult(new
            {
                StatusCode = HttpStatusCode.BadRequest,
                Content = errorMessageError
            })
            {
                StatusCode = (int)HttpStatusCode.InternalServerError
            };
            await context.Response.WriteAsync(JsonConvert.SerializeObject(result));
        }


        private string GenerateMessage(Exception exception)
        {
            Dictionary<string, string> message = new Dictionary<string, string>
            {
                { "Message", "ErrorOccurred" }
            };
            if (_internalRequestEvaluator.IsInternal())
            {
                message.Add("ExceptionMessage", exception.Message);
                message.Add("ExceptionType", exception.GetType().FullName);
                message.Add("StackTrace", exception.StackTrace);
                if (exception.InnerException != null)
                {
                    message.Add("InnerException", GenerateMessage(exception.InnerException));
                }
            }
            return JsonConvert.SerializeObject(message);
        }
    }
}
