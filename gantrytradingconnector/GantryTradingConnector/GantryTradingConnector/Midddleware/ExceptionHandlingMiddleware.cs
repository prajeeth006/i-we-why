using Newtonsoft.Json;
using System.Net;

namespace GantryTradingConnector.Midddleware
{
    public class ExceptionHandlingMiddleware
    {
        public RequestDelegate requestDelegate;
        private readonly ILogger<ExceptionHandlingMiddleware> logger;
        public ExceptionHandlingMiddleware
        (RequestDelegate requestDelegate, ILogger<ExceptionHandlingMiddleware> logger)
        {
            this.requestDelegate = requestDelegate;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await requestDelegate(context);
            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }
        private Task HandleException(HttpContext context, Exception ex)
        {
            logger.LogError(ex.ToString());

            var errorMessageObject =
                new { UserErrorMessage = "An internal server error has occurred", Code = (int)HttpStatusCode.InternalServerError, StackTrace = ex.StackTrace, ErrorMessage = ex.Message };

            var errorMessage = JsonConvert.SerializeObject(errorMessageObject);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return context.Response.WriteAsync(errorMessage);
        }
    }
}
