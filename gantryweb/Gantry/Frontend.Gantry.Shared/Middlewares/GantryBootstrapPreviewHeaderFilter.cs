using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System;

namespace Frontend.Gantry.Shared.Middlewares
{
    [AttributeUsage(AttributeTargets.Class)]
    public class GantryBootstrapPreviewHeaderFilter : ResultFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            try
            {
                const string HeaderKeyName = "x-gantry-env";
                if(context.HttpContext?.Request?.Headers != null && context.HttpContext.Request.Headers.TryGetValue(HeaderKeyName, out var previewValue))
                {
                    context.HttpContext.Response.Headers.Add("x-preview-header", previewValue);
                }
            }
            catch (Exception ex)
            {
                Log.Error("Unable to set preview into HttpHeaders", ex);
            }
        }
    }
}
